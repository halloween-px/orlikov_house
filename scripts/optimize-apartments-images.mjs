#!/usr/bin/env node
/**
 * Сжимает фото апартаментов в WebP без заметной потери качества.
 *
 * По умолчанию:
 * - jpg/png → webp (оригинал удаляется после успешной записи)
 * - webp → пересжимается на месте
 * - длинная сторона ограничивается MAX_EDGE (пиксели не увеличиваются)
 *
 * Флаги:
 *   --dry-run          только отчёт, без записи
 *   --keep-originals   не удалять исходные jpg/png
 *   --dir <path>       другая папка (по умолчанию public/img/apartments)
 */

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DEFAULT_DIR = path.resolve("public/img/apartments");
const MAX_EDGE = 2000;
const WEBP_QUALITY = 90;
const WEBP_EFFORT = 6;
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);

function parseArgs(argv) {
  const options = {
    dryRun: false,
    keepOriginals: false,
    dir: DEFAULT_DIR,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--keep-originals") options.keepOriginals = true;
    else if (arg === "--dir") {
      options.dir = path.resolve(argv[i + 1] || "");
      i += 1;
    }
  }

  return options;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function walkImages(rootDir) {
  const results = [];

  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXT.has(ext)) results.push(fullPath);
    }
  }

  await walk(rootDir);
  return results.sort();
}

async function optimizeImage(filePath, options) {
  const ext = path.extname(filePath).toLowerCase();
  const isWebp = ext === ".webp";
  const outputPath = isWebp
    ? filePath
    : path.join(
        path.dirname(filePath),
        `${path.basename(filePath, ext)}.webp`,
      );

  const inputStat = await fs.stat(filePath);
  const inputBuffer = await fs.readFile(filePath);

  const image = sharp(inputBuffer, { failOn: "none", animated: false });
  const meta = await image.metadata();

  const width = meta.width || 0;
  const height = meta.height || 0;
  const needsResize = Math.max(width, height) > MAX_EDGE;

  let pipeline = sharp(inputBuffer, { failOn: "none", animated: false }).rotate();

  if (needsResize) {
    pipeline = pipeline.resize({
      width: width >= height ? MAX_EDGE : undefined,
      height: height > width ? MAX_EDGE : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const outputBuffer = await pipeline
    .webp({
      quality: WEBP_QUALITY,
      effort: WEBP_EFFORT,
      smartSubsample: true,
    })
    .toBuffer();

  // Не сохраняем, если стало заметно больше (редко, но бывает на мелких png)
  if (outputBuffer.length >= inputStat.size * 0.98 && isWebp && !needsResize) {
    return {
      filePath,
      outputPath,
      inputBytes: inputStat.size,
      outputBytes: inputStat.size,
      skipped: true,
      reason: "already-optimal",
    };
  }

  if (options.dryRun) {
    return {
      filePath,
      outputPath,
      inputBytes: inputStat.size,
      outputBytes: outputBuffer.length,
      skipped: false,
      dryRun: true,
    };
  }

  // Если пишем поверх того же webp — атомарно через temp
  const tempPath = `${outputPath}.${createHash("md5")
    .update(filePath)
    .digest("hex")
    .slice(0, 8)}.tmp.webp`;

  await fs.writeFile(tempPath, outputBuffer);
  await fs.rename(tempPath, outputPath);

  if (!isWebp && !options.keepOriginals && outputPath !== filePath) {
    await fs.unlink(filePath);
  }

  return {
    filePath,
    outputPath,
    inputBytes: inputStat.size,
    outputBytes: outputBuffer.length,
    skipped: false,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const files = await walkImages(options.dir);

  if (files.length === 0) {
    console.log(`Нет изображений в ${options.dir}`);
    return;
  }

  console.log(
    `Оптимизация ${files.length} файлов в ${options.dir}` +
      (options.dryRun ? " (dry-run)" : ""),
  );
  console.log(
    `Параметры: WebP q=${WEBP_QUALITY}, max side=${MAX_EDGE}px, effort=${WEBP_EFFORT}`,
  );

  let inputTotal = 0;
  let outputTotal = 0;
  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const filePath of files) {
    const relative = path.relative(options.dir, filePath);
    try {
      const result = await optimizeImage(filePath, options);
      inputTotal += result.inputBytes;
      outputTotal += result.outputBytes;

      if (result.skipped) {
        skipped += 1;
        console.log(`· skip  ${relative} (${result.reason})`);
        continue;
      }

      processed += 1;
      const saved = result.inputBytes - result.outputBytes;
      const pct = result.inputBytes
        ? Math.round((saved / result.inputBytes) * 100)
        : 0;
      const outRel = path.relative(options.dir, result.outputPath);
      console.log(
        `✓ ${relative} → ${outRel}  ${formatBytes(result.inputBytes)} → ${formatBytes(result.outputBytes)} (${pct > 0 ? "-" : "+"}${Math.abs(pct)}%)`,
      );
    } catch (error) {
      failed += 1;
      console.error(`✗ ${relative}:`, error instanceof Error ? error.message : error);
    }
  }

  const savedTotal = inputTotal - outputTotal;
  console.log("\nГотово");
  console.log(`  обработано: ${processed}`);
  console.log(`  пропущено:  ${skipped}`);
  console.log(`  ошибок:     ${failed}`);
  console.log(
    `  размер:     ${formatBytes(inputTotal)} → ${formatBytes(outputTotal)} (экономия ${formatBytes(Math.max(0, savedTotal))})`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

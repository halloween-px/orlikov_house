#!/usr/bin/env node
/**
 * Нормализует сырую выгрузку лотов:
 * - папки «N …» → lot-N
 * - файлы 01.png / 7.jpg → временные ASCII-имена, затем N.ext без ведущих нулей
 *
 * Использование:
 *   node scripts/normalize-apartments-folder.mjs --dir public/img/apartments_v3
 *   node scripts/normalize-apartments-folder.mjs --dir public/img/apartments_v3 --dry-run
 */

import { promises as fs } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const options = { dir: "", dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--dir") {
      options.dir = path.resolve(argv[++i] || "");
    }
  }
  return options;
}

function naturalKey(name) {
  return name.replace(/(\d+)/g, (m) => m.padStart(8, "0"));
}

async function renameSafe(from, to, dryRun) {
  if (from === to) return;
  if (dryRun) {
    console.log(`  rename: ${path.basename(from)} → ${path.basename(to)}`);
    return;
  }
  await fs.rename(from, to);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.dir) {
    console.error("Укажите --dir <path>");
    process.exit(1);
  }

  const entries = await fs.readdir(options.dir, { withFileTypes: true });
  const folders = entries.filter((e) => e.isDirectory());

  console.log(
    `Нормализация ${options.dir}${options.dryRun ? " (dry-run)" : ""}`,
  );

  for (const entry of folders) {
    const match = entry.name.match(/^(\d+)\b/);
    if (!match) {
      console.warn(`⏭  пропуск (нет номера лота): ${entry.name}`);
      continue;
    }

    const lot = match[1];
    const fromDir = path.join(options.dir, entry.name);
    const toDir = path.join(options.dir, `lot-${lot}`);

    console.log(`\n📁 ${entry.name} → lot-${lot}`);

    if (entry.name !== `lot-${lot}`) {
      if (!options.dryRun && (await exists(toDir))) {
        throw new Error(`Уже существует: ${toDir}`);
      }
      await renameSafe(fromDir, toDir, options.dryRun);
    }

    const workDir = options.dryRun ? fromDir : toDir;
    const files = (await fs.readdir(workDir, { withFileTypes: true }))
      .filter((f) => f.isFile())
      .map((f) => f.name)
      .filter((name) => /\.(jpe?g|png|webp|tiff?)$/i.test(name))
      .sort((a, b) => naturalKey(a).localeCompare(naturalKey(b)));

    // Phase 1: unique temp names
    const mapped = [];
    for (let i = 0; i < files.length; i += 1) {
      const name = files[i];
      const ext = path.extname(name).toLowerCase();
      const base = path.basename(name, path.extname(name));
      const numMatch = base.match(/^0*(\d+)$/);
      const finalBase = numMatch ? numMatch[1] : `${i + 1}`;
      const tempName = `__tmp_${String(i + 1).padStart(3, "0")}${ext}`;
      const finalName = `${finalBase}${ext}`;
      mapped.push({ name, tempName, finalName });
    }

    // Detect final-name collisions (e.g. 4.png + 4.webp)
    const finals = new Map();
    for (const item of mapped) {
      const key = item.finalName.toLowerCase();
      if (finals.has(key)) {
        throw new Error(
          `Конфликт имён в lot-${lot}: ${finals.get(key)} и ${item.name} → ${item.finalName}`,
        );
      }
      finals.set(key, item.name);
    }

    for (const item of mapped) {
      await renameSafe(
        path.join(workDir, item.name),
        path.join(workDir, item.tempName),
        options.dryRun,
      );
    }
    for (const item of mapped) {
      await renameSafe(
        path.join(workDir, item.tempName),
        path.join(workDir, item.finalName),
        options.dryRun,
      );
    }

    console.log(`   файлов: ${mapped.length}`);
  }

  console.log("\nГотово.");
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

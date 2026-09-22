/** Пути к фото лотов из public/img/apartments_v2 (ASCII-папки, без encodeURI — next/image кодирует сам) */

/** Смена версии сбрасывает кэш /_next/image при замене файлов с теми же именами */
const MEDIA_CACHE_VERSION = "20260922";

function mediaUrl(folder: string, file: string) {
  return `/img/apartments_v2/${folder}/${file}?v=${MEDIA_CACHE_VERSION}`;
}

type ApartmentMedia = {
  folder: string;
  preview: string;
  files: readonly string[];
};

const mediaByLot: Record<number, ApartmentMedia> = {
  1: {
    folder: "lot-1",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
    ],
  },
  3: {
    folder: "lot-3",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
      "9.webp",
    ],
  },
  4: {
    folder: "lot-4",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
    ],
  },
  5: {
    folder: "lot-5",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
      "9.webp",
    ],
  },
  6: {
    folder: "lot-6",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
    ],
  },
  8: {
    folder: "lot-8",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
      "9.webp",
    ],
  },
  9: {
    folder: "lot-9",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
      "9.webp",
      "10.webp",
    ],
  },
  10: {
    folder: "lot-10",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
    ],
  },
  13: {
    folder: "lot-13",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
    ],
  },
  14: {
    folder: "lot-14",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
      "9.webp",
    ],
  },
  15: {
    folder: "lot-15",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
    ],
  },
  16: {
    folder: "lot-16",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
    ],
  },
  17: {
    folder: "lot-17",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
      "9.webp",
    ],
  },
  18: {
    folder: "lot-18",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
    ],
  },
  19: {
    folder: "lot-19",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
    ],
  },
  20: {
    folder: "lot-20",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
    ],
  },
  21: {
    folder: "lot-21",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
    ],
  },
  23: {
    folder: "lot-23",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
    ],
  },
  24: {
    folder: "lot-24",
    preview: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
    ],
  },
};

export function getApartmentMedia(lot: number): {
  preview: string;
  images: string[];
} | null {
  const media = mediaByLot[lot];
  if (!media) return null;

  const images = media.files.map((file) => mediaUrl(media.folder, file));
  return {
    preview: mediaUrl(media.folder, media.preview),
    images,
  };
}

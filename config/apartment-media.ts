/** Пути к фото лотов из public/img/apartments_v2 (ASCII-папки, без encodeURI — next/image кодирует сам) */

function mediaUrl(folder: string, file: string) {
  return `/img/apartments_v2/${folder}/${file}`;
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
      "10.webp",
      "11.webp",
      "12.webp",
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
      "11.webp",
    ],
  },
  10: {
    folder: "lot-10",
    preview: "01-room-wide-cleaned.webp",
    files: [
      "01-room-wide-cleaned.webp",
      "02-corridor-cleaned.webp",
      "03-two-windows-cleaned.webp",
      "04-entrance-enhanced.webp",
      "05-bathroom-toilet-cleaned.webp",
      "06-room-ac-cleaned.webp",
      "07-room-window-cleaned.webp",
      "08-room-overlay-removed.webp",
      "09-long-room-cleaned.webp",
      "10-bathroom-shower-cleaned.webp",
      "11-room-connections-cleaned.webp",
      "plan.webp",
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
      "8.webp",
      "9.webp",
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
      "5-1.webp",
      "6.webp",
      "8.webp",
      "12.webp",
      "building.webp",
      "creative.webp",
    ],
  },
  15: {
    folder: "lot-15",
    preview: "01.webp",
    files: [
      "01.webp",
      "02.webp",
      "03.webp",
      "04.webp",
      "05.webp",
      "06.webp",
      "07.webp",
      "08.webp",
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

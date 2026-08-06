/** Авто-пути к фото лотов из public/img/apartments */

function mediaUrl(folder: string, file: string) {
  return encodeURI(`/img/apartments/${folder}/${file}`);
}

type ApartmentMediaSource = {
  folder: string;
  previewFile: string;
  files: readonly string[];
};

const mediaByUnit: Record<number, ApartmentMediaSource> = {
  1: {
    folder: "1 с ремонтом и сантехникой 1 этаж +",
    previewFile: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "ca6ade9883718855bf97b2fa69ae59cd.png.webp",
      "креатив ЛОТ1.webp",
      "схема готова.webp",
    ],
  },
  3: {
    folder: "3 готов для жизни  1 этаж +",
    previewFile: "01_room_to_entrance.webp",
    files: [
      "01_room_to_entrance.webp",
      "02_kitchen.webp",
      "03_bathroom_wide.webp",
      "04_kitchen_room_without_label.webp",
      "05_bathroom_shower.webp",
      "06_room_long.webp",
      "07_room_to_kitchen.webp",
      "08_entrance_doors.webp",
      "09_plan_enhanced.webp",
    ],
  },
  4: {
    folder: "4 рем.тех 1 этаж +",
    previewFile: "01_room_window_cleaned.webp",
    files: [
      "01_room_window_cleaned.webp",
      "02_room_wide_cleaned.webp",
      "03_corridor_cleaned.webp",
      "04_bathroom_cleaned.webp",
      "05_room_panorama_cleaned.webp",
      "06_entrance_enhanced.webp",
      "lot04_plan_enhanced.webp",
    ],
  },
  5: {
    folder: "5 рем.тех 1 этаж +",
    previewFile: "01_room_door_cleaned.webp",
    files: [
      "01_room_door_cleaned.webp",
      "02_corridor_cleaned.webp",
      "03_two_windows_cleaned.webp",
      "04_two_zones_cleaned.webp",
      "05_bathroom_cleaned.webp",
      "06_entrance_enhanced.webp",
      "07_bathroom_second_cleaned.webp",
      "08_room_overlay_removed.webp",
      "lot05_plan_enhanced.webp",
    ],
  },
  6: {
    folder: "6 готов 1 этаж Хаюм +",
    previewFile: "1.webp",
    files: [
      "1.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "5ec6a5e63ecf33466e4847c5b46fa9ad.png.webp",
      "6.webp",
      "7.webp",
      "дом.webp",
      "Авито карточка.webp",
      "схема 2.webp",
    ],
  },
  8: {
    folder: "8 рем.тех 2 этаж +",
    previewFile: "01_main_room.webp",
    files: [
      "01_main_room.webp",
      "02_wide_room.webp",
      "03_two_zones.webp",
      "04_view_to_bathroom.webp",
      "05_corridor.webp",
      "06_bathroom.webp",
      "07_three_windows.webp",
      "08_corner_windows.webp",
      "09_shower_detail.webp",
      "10_room_bathroom.webp",
      "11_single_window.webp",
      "12_niche_corridor.webp",
      "13_room_without_old_label.webp",
      "14_entrance_doors.webp",
      "lot08_plan_enhanced.webp",
    ],
  },
  9: {
    folder: "9 рем.тех 2 этаж +",
    previewFile: "01_two_windows.webp",
    files: [
      "01_two_windows.webp",
      "02_shower_bathroom.webp",
      "03_long_room.webp",
      "04_view_to_entrance.webp",
      "05_room_without_old_label.webp",
      "06_wide_room.webp",
      "07_bathroom_toilet.webp",
      "08_entrance_corridor.webp",
      "09_wide_two_windows.webp",
      "10_single_window_room.webp",
      "11_entrance_doors.webp",
      "lot09_plan_enhanced.webp",
    ],
  },
  10: {
    folder: "10 рем.тех 2 этаж +",
    previewFile: "01_room_wide_cleaned.webp",
    files: [
      "01_room_wide_cleaned.webp",
      "02_corridor_cleaned.webp",
      "03_two_windows_cleaned.webp",
      "04_entrance_enhanced.webp",
      "05_bathroom_toilet_cleaned.webp",
      "06_room_ac_cleaned.webp",
      "07_room_window_cleaned.webp",
      "08_room_overlay_removed.webp",
      "09_long_room_cleaned.webp",
      "10_bathroom_shower_cleaned.webp",
      "11_room_connections_cleaned.webp",
      "lot10_plan_original.png.webp",
    ],
  },
  14: {
    folder: "14 готов 3 этаж +",
    previewFile: "1.webp",
    files: [
      "1.webp",
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "дом2.webp",
      "креативИТОГ.webp",
      "готово схема.webp",
    ],
  },
};

export function getApartmentMedia(unit: number): {
  preview: string;
  images: string[];
} | null {
  const media = mediaByUnit[unit];
  if (!media) return null;

  const images = media.files.map((file) => mediaUrl(media.folder, file));
  return {
    preview: mediaUrl(media.folder, media.previewFile),
    images,
  };
}

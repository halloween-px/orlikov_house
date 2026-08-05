export type ApartmentFinish = "turnkey" | "renovation";
export type ApartmentAvailability = "available" | "sold" | "rental_business";

export interface Apartment {
  id: string;
  unit: number;
  floor: 1 | 2 | 3 | 4;
  name: string;
  title: string;
  area: string;
  rooms: string;
  windows: string;
  finish: ApartmentFinish;
  finishLabel: string;
  description: string;
  highlights: readonly string[];
  price: number;
  priceOld?: number;
  promo?: boolean;
  availability: ApartmentAvailability;
  address: string;
  preview: string;
  images: string[];
}

const ADDRESS = "Москва, Садовая-Спасская 19к3";

const PREVIEWS = [
  "/img/apartments/apartment-2094661_1920 1.png",
  "/img/apartments/interior-design-437204_1920 1.png",
  "/img/apartments/outsite-co-R-LK3sqLiBw-unsplash 1@2x.png",
] as const;

function previewFor(index: number) {
  return PREVIEWS[index % PREVIEWS.length];
}

export const FLOORS_COUNT = 4;

export const finishMeta = {
  renovation: {
    label: "Ремонт + сантехника",
    includes: ["Ремонт", "Сантехника"] as const,
  },
  turnkey: {
    label: "Готов для жизни",
    includes: ["Ремонт", "Сантехника", "Мебель", "Техника"] as const,
  },
} as const;

export const availabilityMeta = {
  available: { label: "В продаже" },
  sold: { label: "Продан" },
  rental_business: { label: "Готовый арендный бизнес" },
} as const;

function floorLabel(floor: number) {
  return `${floor} этаж`;
}

export function formatApartmentFloor(floor: number) {
  return floorLabel(floor);
}

export function getApartmentFinish(finish: ApartmentFinish) {
  return finishMeta[finish];
}

export function getApartmentAvailability(
  availability: ApartmentAvailability = "available",
) {
  return availabilityMeta[availability];
}

export const apartmentsConfig = [
  {
    id: "spasskaya-1",
    unit: 1,
    floor: 1,
    name: "1/4",
    title: "Актуальные решения",
    area: "17,7 м²",
    rooms: "1-комн студия",
    windows: "2 окна",
    finish: "turnkey",
    finishLabel: finishMeta.turnkey.label,
    description: "17,7 м² · 1 этаж · Готов для жизни",
    highlights: ["Готов для жизни", "Два окна"],
    price: 16_620_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(0),
    images: [],
  },
  {
    id: "spasskaya-3",
    unit: 3,
    floor: 1,
    name: "1/4",
    title: "Модный формат",
    area: "17,5 м²",
    rooms: "2-комн студия",
    windows: "2 окна",
    finish: "renovation",
    finishLabel: finishMeta.renovation.label,
    description: "17,5 м² · 1 этаж · Ремонт + сантехника",
    highlights: ["Ремонт + сантехника", "Два окна"],
    price: 16_055_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(1),
    images: [],
  },
  {
    id: "spasskaya-4",
    unit: 4,
    floor: 1,
    name: "1/4",
    title: "Жить в тренде",
    area: "18,1 м²",
    rooms: "1-комн студия",
    windows: "1 окно",
    finish: "renovation",
    finishLabel: finishMeta.renovation.label,
    description: "18,1 м² · 1 этаж · Ремонт + сантехника",
    highlights: ["Ремонт + сантехника", "Уединённое пространство"],
    price: 19_555_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(2),
    images: [],
  },
  {
    id: "spasskaya-5",
    unit: 5,
    floor: 1,
    name: "1/4",
    title: "Многофункциональность",
    area: "22,5 м²",
    rooms: "1-комн студия",
    windows: "2 окна",
    finish: "turnkey",
    finishLabel: finishMeta.turnkey.label,
    description: "22,5 м² · 1 этаж · Готов для жизни",
    highlights: ["Готов для жизни", "Два окна"],
    price: 17_387_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(0),
    images: [],
  },
  {
    id: "spasskaya-6",
    unit: 6,
    floor: 1,
    name: "1/4",
    title: "Стильный выбор",
    area: "19,5 м²",
    rooms: "2-комн студия",
    windows: "2 окна",
    finish: "turnkey",
    finishLabel: finishMeta.turnkey.label,
    description: "19,5 м² · 1 этаж · Готов для жизни",
    highlights: ["Готов для жизни", "Два окна"],
    price: 18_600_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(1),
    images: [],
  },
  {
    id: "spasskaya-8",
    unit: 8,
    floor: 2,
    name: "2/4",
    title: "Свежий взгляд",
    area: "23,2 м²",
    rooms: "2-комн студия",
    windows: "2 окна",
    finish: "renovation",
    finishLabel: finishMeta.renovation.label,
    description: "23,2 м² · 2 этаж · Ремонт + сантехника",
    highlights: ["Ремонт + сантехника", "Два окна"],
    price: 20_815_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(2),
    images: [],
  },
  {
    id: "spasskaya-9",
    unit: 9,
    floor: 2,
    name: "2/4",
    title: "Практичное пространство",
    area: "20,9 м²",
    rooms: "2-комн студия",
    windows: "3 окна",
    finish: "renovation",
    finishLabel: finishMeta.renovation.label,
    description: "20,9 м² · 2 этаж · Ремонт + сантехника",
    highlights: ["Ремонт + сантехника", "Три окна"],
    price: 18_999_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(0),
    images: [],
  },
  {
    id: "spasskaya-10",
    unit: 10,
    floor: 2,
    name: "2/4",
    title: "Стиль минимализма",
    area: "23,9 м²",
    rooms: "2-комн студия",
    windows: "2 окна",
    finish: "renovation",
    finishLabel: finishMeta.renovation.label,
    description: "23,9 м² · 2 этаж · Ремонт + сантехника",
    highlights: ["Ремонт + сантехника", "Два окна"],
    price: 20_420_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(1),
    images: [],
  },
  {
    id: "spasskaya-13",
    unit: 13,
    floor: 3,
    name: "3/4",
    title: "Оптимизация пространства",
    area: "23,3 м²",
    rooms: "1-комн студия",
    windows: "2 окна",
    finish: "turnkey",
    finishLabel: finishMeta.turnkey.label,
    description: "23,3 м² · 3 этаж · Готов для жизни",
    highlights: ["Готов для жизни", "Два окна"],
    price: 19_550_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(2),
    images: [],
  },
  {
    id: "spasskaya-14",
    unit: 14,
    floor: 3,
    name: "3/4",
    title: "Технологичность и комфорт",
    area: "19,8 м²",
    rooms: "2-комн студия",
    windows: "2 окна",
    finish: "turnkey",
    finishLabel: finishMeta.turnkey.label,
    description: "19,8 м² · 3 этаж · Готов для жизни",
    highlights: ["Готов для жизни", "Места хранения"],
    price: 22_075_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(0),
    images: [],
  },
  {
    id: "spasskaya-15",
    unit: 15,
    floor: 3,
    name: "3/4",
    title: "Прогрессивный подход",
    area: "20,4 м²",
    rooms: "2-комн студия",
    windows: "2 окна",
    finish: "turnkey",
    finishLabel: finishMeta.turnkey.label,
    description: "20,4 м² · 3 этаж · Готов для жизни",
    highlights: ["Готов для жизни", "Два окна"],
    price: 19_940_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(1),
    images: [],
  },
  {
    id: "spasskaya-16",
    unit: 16,
    floor: 3,
    name: "3/4",
    title: "Городской ритм",
    area: "19,3 м²",
    rooms: "1-комн студия",
    windows: "2 окна",
    finish: "renovation",
    finishLabel: finishMeta.renovation.label,
    description: "19,3 м² · 3 этаж · Ремонт + сантехника",
    highlights: ["Ремонт + сантехника", "Окна на обе стороны"],
    price: 18_150_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(2),
    images: [],
  },
  {
    id: "spasskaya-17",
    unit: 17,
    floor: 3,
    name: "3/4",
    title: "Умное пространство",
    area: "22,3 м²",
    rooms: "2-комн студия",
    windows: "2 окна",
    finish: "renovation",
    finishLabel: finishMeta.renovation.label,
    description: "22,3 м² · 3 этаж · Ремонт + сантехника",
    highlights: ["Ремонт + сантехника", "Акция"],
    price: 15_300_000,
    promo: true,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(0),
    images: [],
  },
  {
    id: "spasskaya-18",
    unit: 18,
    floor: 3,
    name: "3/4",
    title: "Уютная атмосфера",
    area: "21,2 м²",
    rooms: "2-комн студия",
    windows: "2 окна",
    finish: "turnkey",
    finishLabel: finishMeta.turnkey.label,
    description: "21,2 м² · 3 этаж · Готов для жизни",
    highlights: ["Готовый арендный бизнес", "С арендатором"],
    price: 15_440_000,
    priceOld: 18_600_000,
    promo: true,
    availability: "rental_business",
    address: ADDRESS,
    preview: previewFor(1),
    images: [],
  },
  {
    id: "spasskaya-19",
    unit: 19,
    floor: 4,
    name: "4/4",
    title: "Эффективные решения",
    area: "22,4 м²",
    rooms: "1-комн студия",
    windows: "2 окна",
    finish: "turnkey",
    finishLabel: finishMeta.turnkey.label,
    description: "22,4 м² · 4 этаж · Готов для жизни",
    highlights: ["Готов для жизни", "Окна на обе стороны"],
    price: 19_470_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(2),
    images: [],
  },
  {
    id: "spasskaya-20",
    unit: 20,
    floor: 4,
    name: "4/4",
    title: "Комфорт мегаполиса",
    area: "19,8 м²",
    rooms: "2-комн студия",
    windows: "3 окна",
    finish: "turnkey",
    finishLabel: finishMeta.turnkey.label,
    description: "19,8 м² · 4 этаж · Готов для жизни",
    highlights: ["Готов для жизни", "Три окна"],
    price: 24_100_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(0),
    images: [],
  },
  {
    id: "spasskaya-21",
    unit: 21,
    floor: 4,
    name: "4/4",
    title: "Современный стандарт",
    area: "21,2 м²",
    rooms: "2-комн студия",
    windows: "3 окна",
    finish: "turnkey",
    finishLabel: finishMeta.turnkey.label,
    description: "21,2 м² · 4 этаж · Готов для жизни",
    highlights: ["Готовый арендный бизнес", "С арендатором"],
    price: 22_560_000,
    availability: "rental_business",
    address: ADDRESS,
    preview: previewFor(1),
    images: [],
  },
  {
    id: "spasskaya-22",
    unit: 22,
    floor: 4,
    name: "4/4",
    title: "Минимализм в деталях",
    area: "21 м²",
    rooms: "1-комн студия",
    windows: "2 окна",
    finish: "turnkey",
    finishLabel: finishMeta.turnkey.label,
    description: "21 м² · 4 этаж · Готов для жизни",
    highlights: ["Продан"],
    price: 20_830_000,
    availability: "sold",
    address: ADDRESS,
    preview: previewFor(2),
    images: [],
  },
  {
    id: "spasskaya-23",
    unit: 23,
    floor: 4,
    name: "4/4",
    title: "Личное пространство",
    area: "24,2 м²",
    rooms: "2-комн студия",
    windows: "2 окна",
    finish: "turnkey",
    finishLabel: finishMeta.turnkey.label,
    description: "24,2 м² · 4 этаж · Готов для жизни",
    highlights: ["Готов для жизни", "Два окна"],
    price: 19_110_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(0),
    images: [],
  },
  {
    id: "spasskaya-24",
    unit: 24,
    floor: 4,
    name: "4/4",
    title: "Функциональный дизайн",
    area: "25,5 м²",
    rooms: "2-комн студия",
    windows: "2 окна",
    finish: "turnkey",
    finishLabel: finishMeta.turnkey.label,
    description: "25,5 м² · 4 этаж · Готов для жизни",
    highlights: ["Готов для жизни", "Два окна"],
    price: 20_340_000,
    availability: "available",

    address: ADDRESS,
    preview: previewFor(1),
    images: [],
  },
] as const satisfies readonly Apartment[];

export type ApartmentsConfig = typeof apartmentsConfig;

export function getApartmentById(id: string) {
  return apartmentsConfig.find((apartment) => apartment.id === id);
}

export function formatApartmentPrice(price: number) {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

export function getApartmentGallery(apartment: Apartment): string[] {
  if (apartment.images.length > 0) {
    return [...apartment.images];
  }

  const start = Math.max(
    0,
    PREVIEWS.indexOf(apartment.preview as (typeof PREVIEWS)[number]),
  );

  return Array.from({ length: 8 }, (_, index) => {
    return PREVIEWS[(start + index) % PREVIEWS.length];
  });
}

export const finishPackages = {
  turnkey: {
    label: finishMeta.turnkey.label,
    summary: "Ремонт, сантехника, мебель и техника",
    extras: "+ келлер в подарок",
    items: [
      {
        title: "Кухня",
        text: "Мебель-кухня, плита, холодильник, вытяжка, кондиционер, ППМ, стол и стулья",
      },
      {
        title: "Ванная",
        text: "Душевая, раковина, унитаз, полотенцесушитель",
      },
      {
        title: "Гостиная-спальня",
        text: "Места хранения, диван-кровать, место под ТВ, много розеток",
      },
    ],
  },
  renovation: {
    label: finishMeta.renovation.label,
    summary: "С ремонтом и сантехникой",
    extras: "+ келлер в подарок",
    items: [
      {
        title: "Кухня",
        text: "Полный ремонт, выводы коммуникаций, кондиционер, розетки",
      },
      {
        title: "Ванная",
        text: "Сантехника в полном объёме — душевая, раковина, унитаз, полотенцесушитель",
      },
      {
        title: "Гостиная-спальня",
        text: "Полный ремонт, розетки, окна, подоконник, плинтус, вывод под ТВ",
      },
    ],
  },
} as const;

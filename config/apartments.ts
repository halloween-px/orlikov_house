export type ApartmentFinish = "turnkey" | "renovation";

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
    finishLabel: "Под ключ",
    description:
      "1-комн студия под ключ — готово для проживания. Два окна, много света; ремонт, мебель, сантехника и кухня.",
    highlights: ["Готово для проживания", "Два окна, много света"],
    price: 16_620_000,
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
    finishLabel: "Ремонт + сантехника",
    description:
      "2-комн студия с ремонтом и сантехникой. Два больших окна, качественная отделка и новая инженерия.",
    highlights: ["Ремонт и сантехника", "Два больших окна"],
    price: 16_055_000,
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
    finishLabel: "Ремонт + сантехника",
    description:
      "1-комн студия с ремонтом и сантехникой. Одно окно — уединённое тихое пространство и эффективная планировка.",
    highlights: ["Уединённое пространство", "Новые коммуникации"],
    price: 19_555_000,
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
    finishLabel: "Под ключ",
    description:
      "1-комн студия под ключ — готово для проживания. Два окна, много света; ремонт, мебель, сантехника и кухня.",
    highlights: ["Готово для проживания", "Два окна, много света"],
    price: 17_387_000,
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
    finishLabel: "Под ключ",
    description:
      "2-комн студия под ключ. Два больших окна, мебель, кухня, сантехника и новые коммуникации.",
    highlights: ["Под ключ", "Два больших окна"],
    price: 18_600_000,
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
    finishLabel: "Ремонт + сантехника",
    description:
      "2-комн студия с ремонтом и сантехникой. Два больших окна и функциональное пространство.",
    highlights: ["Функциональное пространство", "Два больших окна"],
    price: 20_815_000,
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
    finishLabel: "Ремонт + сантехника",
    description:
      "2-комн студия с ремонтом и сантехникой. Три больших окна на две стороны дома, продуманное пространство.",
    highlights: ["Три окна на две стороны", "Качество материалов"],
    price: 18_999_000,
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
    finishLabel: "Ремонт + сантехника",
    description:
      "2-комн студия с ремонтом и сантехникой. Два больших окна, тишина и уединённая планировка.",
    highlights: ["Тишина и свет", "Уединённая планировка"],
    price: 20_420_000,
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
    finishLabel: "Под ключ",
    description:
      "1-комн студия, готово для проживания. Два больших окна, комфортное уединённое пространство.",
    highlights: ["Готово для проживания", "Два больших окна"],
    price: 19_550_000,
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
    finishLabel: "Под ключ",
    description:
      "2-комн студия под ключ. Два окна, много мест хранения и стильная кухня.",
    highlights: ["Много мест хранения", "Стильная кухня"],
    price: 22_075_000,
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
    finishLabel: "Под ключ",
    description:
      "2-комн студия под ключ. Два окна, ремонт, мебель, сантехника и кухня.",
    highlights: ["Под ключ", "Два окна, много света"],
    price: 19_940_000,
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
    finishLabel: "Ремонт + сантехника",
    description:
      "1-комн студия с ремонтом и сантехникой. Два больших окна на обе стороны дома.",
    highlights: ["Окна на обе стороны", "Новая инженерия"],
    price: 18_150_000,
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
    finishLabel: "Ремонт + сантехника",
    description:
      "2-комн студия с ремонтом и сантехникой. Два больших окна и эргономичное пространство.",
    highlights: ["Акция", "Эргономичный формат"],
    price: 15_300_000,
    promo: true,
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
    finishLabel: "Под ключ",
    description:
      "2-комн студия, готово для проживания. Два больших окна, качественная отделка и новая инженерия.",
    highlights: ["Акция", "Готово для проживания"],
    price: 15_440_000,
    priceOld: 18_600_000,
    promo: true,
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
    finishLabel: "Под ключ",
    description:
      "1-комн студия, готово для проживания. Два больших окна на обе стороны дома, приватная планировка.",
    highlights: ["Окна на обе стороны", "Приватный минимализм"],
    price: 19_470_000,
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
    finishLabel: "Под ключ",
    description:
      "2-комн студия под ключ. Три окна, стильная кухня, вся техника и мебель.",
    highlights: ["Три окна", "Техника и мебель"],
    price: 24_100_000,
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
    finishLabel: "Под ключ",
    description:
      "2-комн студия под ключ. Три окна, полная комплектация для проживания и много мест хранения.",
    highlights: ["Три окна", "Полная комплектация"],
    price: 22_560_000,
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
    finishLabel: "Под ключ",
    description:
      "1-комн студия, готово для проживания. Два больших окна, качественная отделка и новая инженерия.",
    highlights: ["Готово для проживания", "Два больших окна"],
    price: 20_830_000,
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
    finishLabel: "Под ключ",
    description:
      "2-комн студия под ключ. Два больших окна, качественная отделка, сантехника и новая инженерия.",
    highlights: ["Под ключ", "Два больших окна"],
    price: 19_110_000,
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
    finishLabel: "Под ключ",
    description:
      "2-комн студия под ключ. Два больших окна, тишина и уют, комфортная планировка.",
    highlights: ["Тишина и уют", "Всё необходимое"],
    price: 20_340_000,
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

  const start = Math.max(0, PREVIEWS.indexOf(apartment.preview as (typeof PREVIEWS)[number]));

  return Array.from({ length: 8 }, (_, index) => {
    return PREVIEWS[(start + index) % PREVIEWS.length];
  });
}

export const finishPackages = {
  turnkey: {
    label: "Под ключ",
    summary: "Готово для проживания: ремонт, кухня, мебель, техника",
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
    label: "Ремонт + сантехника",
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


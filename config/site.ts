import type { SiteParams } from "@/types";
import type { HeroSlide } from "@/types/hero";

export const siteConfig = {
  brand: {
    name: "Орликов дом",
    logoLine1: "Орликов",
    logoLine2: "дом",
    tagline: "Орликов дом",
    descriptionLine1: "Камерный дом премиум-класса",
    descriptionLine2: "в тихом дворе Садового кольца",
  },

  meta: {
    title:
      "Орликов дом — студии у м. Красные Ворота в ЦАО | от 15,3 млн ₽",
    description:
      "Камерный дом премиум-класса в центре Москвы: Садовая-Спасская 19к3, 1 минута до м. Красные Ворота. Лоты с ремонтом и сантехникой, часть — с мебелью. Гостиничный статус, показ ежедневно.",
  },

  header: {
    phoneLabel: "Позвоните нам",
    requestButtonLabel: "Оставить заявку",
    menuAriaLabel: "Открыть меню",
    heightTop: 90,
  },

  contacts: {
    phone: {
      title: "+7 (993) 620-27-36",
      link: "tel:+79936202736",
    },
    email: {
      title: "info@orlikovhome.ru",
      link: "mailto:info@orlikovhome.ru",
    },
    address: {
      title: "Садовая-Спасская 19к3",
      full: "г. Москва, ул. Садовая-Спасская, д. 19, корп. 3",
    },
    metro: "м. Красные Ворота",
    district: "ЦАО",
    hours: "Ежедневно, 9:00–21:00",
    social: [
      { title: "vkontakte", icon: "vk", link: "#" },
      { title: "instagram", icon: "instagram", link: "#" },
      { title: "telegram", icon: "telegram", link: "#" },
      { title: "youtube", icon: "youtube", link: "#" },
    ],
  } satisfies SiteParams & {
    address: { title: string; full: string };
    metro: string;
    district: string;
    hours: string;
  },

  hero: {
    defaultImage: "/img/slider/hero-main.webp",
    title: "Орликов дом",
    subtitle:
      "Камерный дом премиум-класса\nв тихом дворе Садового кольца",
    chips: [
      "100 метров до метро",
      "Готовые студии в центре",
      "Под жизнь и аренду",
    ],
    pdfCta: {
      label: "Скачать PDF",
      href: "/catalog.pdf",
      download: "orlikov-haus-catalog.pdf",
    },
    primaryCta: {
      label: "Выбрать студию",
      href: "#catalog",
    },
    secondaryCta: {
      label: "Записаться на просмотр",
      action: "lead" as const,
    },
    /** @deprecated use primaryCta */
    offersLink: {
      label: "Выбрать студию",
      href: "#catalog",
    },
    slides: [
      {
        id: "main",
        label: "Орликов дом",
        image: "/img/slider/hero-main.webp",
        title: "Орликов дом",
        subtitle:
          "Камерный дом премиум-класса\nв тихом дворе Садового кольца",
        chips: [
          "100 метров до метро",
          "Готовые студии в центре",
          "Под жизнь и аренду",
        ],
        primaryCta: {
          label: "Выбрать студию",
          href: "#catalog",
        },
        secondaryCta: {
          label: "Записаться на просмотр",
          action: "lead",
        },
      },
      {
        id: "location",
        label: "Локация",
        image: "/img/apartments/lot-6/building.webp",
        title: "ЦАО, Красные Ворота",
        subtitle:
          "Дом расположен в тихом дворе на Садовой-Спасской, рядом с метро и Садовым кольцом",
        primaryCta: {
          label: "Записаться на просмотр",
          action: "lead",
        },
      },
      {
        id: "studios",
        label: "Студии",
        image: "/img/apartments_v2/lot-1/1.webp",
        title: "Студии с готовой отделкой",
        subtitle: "24 студии в тихом дворе Садового кольца",
        primaryCta: {
          label: "Выбрать студию",
          href: "#catalog",
        },
      },
    ] satisfies HeroSlide[],
  },

  assets: {
    logoVector: "/logo.svg",
    slogan: "/img/slogan.svg",
  },

  requestForm: {
    title: "Записаться на просмотр",
    requestTitle: "Оставить заявку",
    nameLabel: "Имя",
    namePlaceholder: "Иван",
    phoneLabel: "Телефон",
    phonePlaceholder: "+7 (999) 999-99-99",
    submitLabel: "Отправить",
    successMessage: "Мы с вами свяжемся",
  },
} as const;

export type SiteConfig = typeof siteConfig;

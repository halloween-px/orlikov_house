import type { Metadata } from "next";
import { siteConfig } from "./site";

const FALLBACK_SITE_URL = "https://orlikovhome.ru";

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return fromEnv || FALLBACK_SITE_URL;
}

export const seoConfig = {
  siteUrl: getSiteUrl(),
  locale: "ru_RU",
  language: "ru",
  brand: siteConfig.brand.name,
  email: siteConfig.contacts.email.title,
  phone: siteConfig.contacts.phone.title,
  phoneE164: "+79936202736",
  address: {
    street: "ул. Садовая-Спасская, д. 19, корп. 3",
    locality: "Москва",
    region: "Москва",
    postalCode: "107078",
    country: "RU",
    full: siteConfig.contacts.address.full,
  },
  geo: {
    latitude: 55.7694,
    longitude: 37.6493,
  },
  defaultOgImage: "/img/apartments/lot-6/building.webp",
  keywords: [
    "Орликов дом",
    "студии Красные Ворота",
    "студии ЦАО",
    "студии Садовая-Спасская",
    "купить студию Москва центр",
    "студии у метро Красные Ворота",
    "студии для инвестиций Москва",
    "готовый арендный бизнес Москва",
    "камерный дом премиум-класса",
  ],
  home: {
    title:
      "Орликов дом — студии у м. Красные Ворота в ЦАО | от 15,3 млн ₽",
    description:
      "Камерный дом премиум-класса в центре Москвы: Садовая-Спасская 19к3, 1 минута до м. Красные Ворота. Лоты с ремонтом и сантехникой, часть — с мебелью. Гостиничный статус, показ ежедневно.",
    path: "/",
  },
  apartments: {
    title:
      "Студии Орликов дом — все лоты, цены и планировки | Красные Ворота",
    description:
      "Каталог студий Орликов дом: площади 17–25 м², этажи 1–4, форматы «ремонт + сантехника» и «готов для жизни». Актуальные цены, лоты с арендаторами и проданные объекты.",
    path: "/apartments",
  },
} as const;

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: readonly string[];
  image?: string;
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords = seoConfig.keywords,
  image = seoConfig.defaultOgImage,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const url = new URL(path, seoConfig.siteUrl).toString();
  const imageUrl = new URL(image, seoConfig.siteUrl).toString();

  return {
    title,
    description,
    keywords: [...keywords],
    authors: [{ name: seoConfig.brand }],
    creator: seoConfig.brand,
    publisher: seoConfig.brand,
    category: "real estate",
    alternates: {
      canonical: url,
      languages: {
        "ru-RU": url,
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: seoConfig.locale,
      url,
      siteName: seoConfig.brand,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${seoConfig.brand} — студии в ЦАО`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

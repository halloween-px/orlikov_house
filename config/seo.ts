import type { Metadata } from "next";
import { siteConfig } from "./site";
import { seoKeywords } from "./seo-keywords";

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
  email: siteConfig.contacts.emails.map((item) => item.title),
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
    latitude: 55.769997,
    longitude: 37.64741,
  },
  defaultOgImage: "/img/apartments_v2/lot-6/1.webp",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-120.png", type: "image/png", sizes: "120x120" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
    shortcut: "/favicon.ico",
  },
  keywords: seoKeywords,
  home: {
    title:
      "Купить студию в центре Москвы — Орликов дом, ЦАО | от 15,3 млн ₽",
    description:
      "Купить студию или маленькую однушку в центре Москвы: Орликов дом в ЦАО, 1 минута до м. Красные Ворота. 24 студии 17–25 м² с ремонтом и мебелью, от 15,3 млн ₽. Показ ежедневно.",
    path: "/",
  },
  apartments: {
    title:
      "Купить студию в центре Москвы — каталог лотов и цены | Красные Ворота",
    description:
      "Каталог студий и маленьких однушек в центре Москвы: площади 17–25 м², ЦАО, м. Красные Ворота. Актуальные цены, планировки, готовая отделка и лоты с арендаторами.",
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
    icons: {
      icon: [...seoConfig.icons.icon],
      apple: [...seoConfig.icons.apple],
      shortcut: seoConfig.icons.shortcut,
    },
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
          alt: `${seoConfig.brand} — купить студию в центре Москвы, ЦАО`,
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

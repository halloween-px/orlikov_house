import {
  apartmentsConfig,
  formatApartmentPrice,
  type Apartment,
} from "@/config/apartments";
import { seoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";

function absoluteUrl(path: string) {
  return new URL(path, seoConfig.siteUrl).toString();
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    "@id": `${seoConfig.siteUrl}/#organization`,
    name: seoConfig.brand,
    description:
      "Купить студию или маленькую однушку в центре Москвы: камерный дом премиум-класса в ЦАО у м. Красные Ворота, студии 17–25 м² с готовой отделкой.",
    url: seoConfig.siteUrl,
    logo: absoluteUrl(siteConfig.assets.logoVector),
    image: absoluteUrl(seoConfig.defaultOgImage),
    email: seoConfig.email,
    telephone: seoConfig.phoneE164,
    priceRange: "₽₽₽",
    address: {
      "@type": "PostalAddress",
      streetAddress: seoConfig.address.street,
      addressLocality: seoConfig.address.locality,
      addressRegion: seoConfig.address.region,
      postalCode: seoConfig.address.postalCode,
      addressCountry: seoConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: seoConfig.geo.latitude,
      longitude: seoConfig.geo.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
    areaServed: {
      "@type": "City",
      name: "Москва",
    },
  };
}

export function getApartmentComplexJsonLd() {
  const available = apartmentsConfig.filter(
    (apartment) => apartment.availability !== "sold",
  );
  const prices = available.map((apartment) => apartment.price);
  const lowPrice = Math.min(...prices);
  const highPrice = Math.max(...prices);

  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    "@id": `${seoConfig.siteUrl}/#apartment-complex`,
    name: seoConfig.brand,
    description:
      "Купить студию в центре Москвы: 24 готовые студии и маленькие однушки 17–25 м² в ЦАО, м. Красные Ворота, от 15,3 млн ₽.",
    url: seoConfig.siteUrl,
    image: absoluteUrl(seoConfig.defaultOgImage),
    numberOfAccommodationUnits: apartmentsConfig.length,
    address: {
      "@type": "PostalAddress",
      streetAddress: seoConfig.address.street,
      addressLocality: seoConfig.address.locality,
      addressRegion: seoConfig.address.region,
      postalCode: seoConfig.address.postalCode,
      addressCountry: seoConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: seoConfig.geo.latitude,
      longitude: seoConfig.geo.longitude,
    },
    containedInPlace: {
      "@type": "Place",
      name: "ЦАО, м. Красные Ворота",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "RUB",
      lowPrice,
      highPrice,
      offerCount: available.length,
      availability: "https://schema.org/InStock",
    },
  };
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${seoConfig.siteUrl}/#website`,
    name: seoConfig.brand,
    url: seoConfig.siteUrl,
    inLanguage: "ru-RU",
    publisher: {
      "@id": `${seoConfig.siteUrl}/#organization`,
    },
  };
}

export function getApartmentJsonLd(apartment: Apartment) {
  const path = `/apartments/${apartment.id}`;

  return {
    "@context": "https://schema.org",
    "@type": "Apartment",
    "@id": `${seoConfig.siteUrl}${path}#apartment`,
    name: `Лот ${apartment.unit} — Орликов дом`,
    description: apartment.description,
    url: absoluteUrl(path),
    image: absoluteUrl(apartment.preview),
    floorSize: {
      "@type": "QuantitativeValue",
      value: Number.parseFloat(apartment.area.replace(",", ".")),
      unitCode: "MTK",
    },
    numberOfRooms: apartment.rooms.includes("2") ? 2 : 1,
    address: {
      "@type": "PostalAddress",
      streetAddress: seoConfig.address.street,
      addressLocality: seoConfig.address.locality,
      addressCountry: seoConfig.address.country,
    },
    offers: {
      "@type": "Offer",
      price: apartment.price,
      priceCurrency: "RUB",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: apartment.price,
        priceCurrency: "RUB",
        name: formatApartmentPrice(apartment.price),
      },
      availability:
        apartment.availability === "sold"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      url: absoluteUrl(path),
    },
  };
}

export function getApartmentListJsonLd() {
  const items = [...apartmentsConfig]
    .sort((a, b) => a.unit - b.unit)
    .map((apartment, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Apartment",
        "@id": `${seoConfig.siteUrl}/apartments/${apartment.id}#apartment`,
        name: `Лот ${apartment.unit} — Орликов дом`,
        description: apartment.description,
        url: absoluteUrl(`/apartments/${apartment.id}`),
        floorSize: {
          "@type": "QuantitativeValue",
          value: Number.parseFloat(apartment.area.replace(",", ".")),
          unitCode: "MTK",
        },
        numberOfRooms: apartment.rooms.includes("2") ? 2 : 1,
        address: {
          "@type": "PostalAddress",
          streetAddress: seoConfig.address.street,
          addressLocality: seoConfig.address.locality,
          addressCountry: seoConfig.address.country,
        },
        offers: {
          "@type": "Offer",
          price: apartment.price,
          priceCurrency: "RUB",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: apartment.price,
            priceCurrency: "RUB",
            name: formatApartmentPrice(apartment.price),
          },
          availability:
            apartment.availability === "sold"
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",
          url: absoluteUrl(`/apartments/${apartment.id}`),
        },
      },
    }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Студии Орликов дом",
    description: seoConfig.apartments.description,
    numberOfItems: items.length,
    itemListElement: items,
  };
}

export function getBreadcrumbJsonLd(
  items: ReadonlyArray<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function getFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Где купить студию в центре Москвы?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "В Орликов дом на Садовой-Спасской 19к3 — камерный дом в ЦАО, 1 минута от м. Красные Ворота. 24 студии 17–25 м² с готовой отделкой, показ ежедневно.",
        },
      },
      {
        "@type": "Question",
        name: "Можно ли купить маленькую однушку в центре Москвы?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да. Студии Орликов дом — формат маленькой однушки 17–25 м² в центре Москвы: кухонная зона, санузел, готовый ремонт или полная меблировка.",
        },
      },
      {
        "@type": "Question",
        name: "Сколько стоит купить студию в центре Москвы в Орликов дом?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Стоимость начинается от 15,3 млн ₽. Актуальные цены по каждому лоту — в каталоге на сайте, можно записаться на просмотр.",
        },
      },
      {
        "@type": "Question",
        name: "Где находится Орликов дом?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Дом расположен по адресу Москва, ул. Садовая-Спасская, д. 19, корп. 3 — в ЦАО, в 1 минуте от метро Красные Ворота, во второй линии Садового кольца.",
        },
      },
      {
        "@type": "Question",
        name: "Какие форматы готовности студий?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Доступны два формата: «ремонт + сантехника» и «готов для жизни» — ремонт, сантехника, мебель и техника.",
        },
      },
      {
        "@type": "Question",
        name: "Можно ли купить лот с арендатором?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да, в доме есть лоты с арендаторами — готовый арендный бизнес. Также действует гостиничный статус: регистрация до 5 лет и легальная аренда, включая посуточную.",
        },
      },
    ],
  };
}

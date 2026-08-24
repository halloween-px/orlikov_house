import type { Metadata, Viewport } from "next";
import { Open_Sans, Roboto } from "next/font/google";
import { siteConfig } from "@/config";
import { buildPageMetadata, seoConfig } from "@/config/seo";
import { MainProvider } from "@/context/MainProvider";
import VisitTracker from "@/components/analytics/VisitTracker";
import { JsonLd } from "@/components/seo";
import {
  getApartmentComplexJsonLd,
  getOrganizationJsonLd,
  getWebsiteJsonLd,
} from "@/lib/seo-schema";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "cyrillic"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111111",
};

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  ...buildPageMetadata({
    title: seoConfig.home.title,
    description: seoConfig.home.description,
    path: seoConfig.home.path,
  }),
  title: {
    default: seoConfig.home.title,
    template: `%s | ${seoConfig.brand}`,
  },
  applicationName: seoConfig.brand,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    "geo.region": "RU-MOW",
    "geo.placename": "Москва",
    "geo.position": `${seoConfig.geo.latitude};${seoConfig.geo.longitude}`,
    ICBM: `${seoConfig.geo.latitude}, ${seoConfig.geo.longitude}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerHeightTop = `${siteConfig.header.heightTop}px`;

  return (
    <html
      lang="ru"
      className={`${openSans.variable} ${roboto.variable} h-full`}
      style={
        {
          "--header-height-top": headerHeightTop,
          "--header-height-bottom": "0px",
          "--header-height": headerHeightTop,
        } as React.CSSProperties
      }
    >
      <body className="min-h-full antialiased">
        <JsonLd
          data={[
            getOrganizationJsonLd(),
            getWebsiteJsonLd(),
            getApartmentComplexJsonLd(),
          ]}
        />
        <MainProvider>
          <VisitTracker />
          {children}
        </MainProvider>
      </body>
    </html>
  );
}

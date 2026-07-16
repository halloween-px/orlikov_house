import type { Metadata } from "next";
import { Open_Sans, Roboto } from "next/font/google";
import { siteConfig } from "@/config";
import { MainProvider } from "@/context/MainProvider";
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

export const metadata: Metadata = {
  title: siteConfig.meta.title,
  description: siteConfig.meta.description,
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
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}

import type { MetadataRoute } from "next";
import { seoConfig } from "@/config/seo";
import { getVisibleApartments } from "@/lib/apartments";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const apartments = await getVisibleApartments();

  const apartmentPages = apartments.map((apartment) => ({
    url: `${seoConfig.siteUrl}/apartments/${apartment.id}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: seoConfig.siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${seoConfig.siteUrl}/apartments`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...apartmentPages,
    {
      url: `${seoConfig.siteUrl}/catalog.pdf`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}

import type { MetadataRoute } from "next";
import { apartmentsConfig } from "@/config";
import { seoConfig } from "@/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const apartmentPages = apartmentsConfig.map((apartment) => ({
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

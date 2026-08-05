import type { MetadataRoute } from "next";
import { seoConfig } from "@/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

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
    {
      url: `${seoConfig.siteUrl}/catalog.pdf`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}

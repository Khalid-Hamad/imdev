import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://imdev.sa";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/blog", "/projects", "/uses"];
  const locales = ["en", "ar"];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}${locale === "en" ? "" : `/${locale}`}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "/blog" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}

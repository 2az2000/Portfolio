import type { MetadataRoute } from "next";
import { LOCALE_PATHS, SITE_URL } from "@/lib/site";

/**
 * Two URLs, one page — the English and Persian renditions.
 *
 * Each entry carries the full `languages` map rather than just naming its own
 * locale. Google treats hreflang as a claim that has to be reciprocated: a
 * page that points at its translation without the translation pointing back
 * is ignored, so both rows advertise both URLs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const languages = {
    en: `${SITE_URL}${LOCALE_PATHS.en}`,
    fa: `${SITE_URL}${LOCALE_PATHS.fa}`,
  };

  return [
    {
      url: `${SITE_URL}${LOCALE_PATHS.en}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}${LOCALE_PATHS.fa}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages },
    },
  ];
}

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Everything is public and meant to be found — this is a portfolio. The only
 * exclusion is the contact endpoint, which answers POST and has nothing to
 * index; keeping crawlers off it saves a pointless 405 in the logs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

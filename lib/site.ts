/**
 * Site-level constants shared by both root layouts, the sitemap, robots.txt
 * and the manifest.
 *
 * The origin lives here rather than in each of those files because it appears
 * in absolute URLs that crawlers compare against each other — a canonical tag
 * and a sitemap entry that disagree about the origin are worse than either
 * being absent.
 */

import { dictionaries } from "@/lib/i18n";

/**
 * Absolute public origin, no trailing slash.
 *
 * The fallback is the Vercel preview domain and is a safety net, not the
 * intended value: set `NEXT_PUBLIC_SITE_URL` in the deployment environment so
 * Open Graph URLs point at the real domain. See `.env.example`.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-amirali.vercel.app"
).replace(/\/$/, "");

/** Where each locale's content lives. Also the shape crawlers see as hreflang. */
export const LOCALE_PATHS = {
  en: "/",
  fa: "/fa",
} as const;

export const SITE_NAME = "Amirali Zand";

/**
 * Derived from the dictionaries rather than retyped, so the title and
 * description a crawler sees are literally the same strings the visitor reads
 * in the hero. A second hand-maintained copy of this copy is a copy that goes
 * stale — and it goes stale silently, because nothing renders it.
 */
export const META = {
  en: {
    title: `${dictionaries.en.hero.title} — Frontend Developer`,
    description: dictionaries.en.hero.subtitle,
    ogLocale: "en_US",
  },
  fa: {
    title: `${dictionaries.fa.hero.title} — Frontend Developer`,
    description: dictionaries.fa.hero.subtitle,
    ogLocale: "fa_IR",
  },
} as const;

/**
 * `alternates` block shared by both layouts. Both locales advertise the same
 * pair, differing only in which one they call canonical — that symmetry is
 * what makes Google treat them as translations of one page rather than as two
 * unrelated documents.
 */
export function alternatesFor(locale: "en" | "fa") {
  return {
    canonical: LOCALE_PATHS[locale],
    languages: {
      en: LOCALE_PATHS.en,
      fa: LOCALE_PATHS.fa,
      "x-default": LOCALE_PATHS.en,
    },
  };
}

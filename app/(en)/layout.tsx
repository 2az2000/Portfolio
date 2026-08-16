import type { Metadata } from "next";
import "../globals.css";
import { RootShell } from "@/components/RootShell";
import { StructuredData } from "@/components/StructuredData";
import { alternatesFor, META, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * The favicon, the apple touch icon and the social card are the AZ mark, and
 * they're picked up from `app/icon.png`, `app/apple-icon.png` and
 * `app/opengraph-image.jpg` by Next's file conventions — which is also why
 * there's no `icons` key here. Those files sit at the `app/` root rather than
 * inside a route group so both locales inherit them.
 *
 * `metadataBase` is what turns the relative paths in `alternates` into the
 * absolute URLs crawlers require.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: META.en.title,
  description: META.en.description,
  alternates: alternatesFor("en"),
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: META.en.title,
    description: META.en.description,
    locale: META.en.ogLocale,
    alternateLocale: META.fa.ogLocale,
  },
  twitter: {
    card: "summary_large_image",
    title: META.en.title,
    description: META.en.description,
  },
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell locale="en">
      <StructuredData />
      {children}
    </RootShell>
  );
}

import type { Metadata } from "next";
import "../globals.css";
import { RootShell } from "@/components/RootShell";
import { alternatesFor, META, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * The Persian half of the site. A second root layout, not a nested one:
 * `lang="fa" dir="rtl"` has to be in the server response, and only a root
 * layout may render `<html>`. See components/RootShell.tsx for why the split
 * exists and what it costs.
 *
 * Icons and the social card resolve from `app/icon.png` and friends, shared
 * with the English group.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: META.fa.title,
  description: META.fa.description,
  alternates: alternatesFor("fa"),
  openGraph: {
    type: "website",
    url: `${SITE_URL}/fa`,
    siteName: SITE_NAME,
    title: META.fa.title,
    description: META.fa.description,
    locale: META.fa.ogLocale,
    alternateLocale: META.en.ogLocale,
  },
  twitter: {
    card: "summary_large_image",
    title: META.fa.title,
    description: META.fa.description,
  },
};

export default function PersianRootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="fa">{children}</RootShell>;
}

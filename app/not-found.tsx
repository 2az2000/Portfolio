import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/components/RootShell";
import { SITE_URL } from "@/lib/site";

/**
 * Rendered for any URL outside `/` and `/fa`.
 *
 * A root not-found sits above both route groups, so neither
 * `app/(en)/layout.tsx` nor `app/(fa)/layout.tsx` wraps it — it gets none of
 * their fonts or chrome. Next does supply a bare `<html>`/`<body>` of its own,
 * which is why this renders no document tags: adding them nests a second
 * `<html>` inside the first. The font variables therefore go on a wrapper
 * element rather than on `<body>`, and cascade from there exactly the same.
 *
 * English only, on purpose: there is no locale in the URL to read, and guessing
 * one for a page whose whole message is "this address is wrong" adds nothing —
 * so it offers both entry points instead.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Not found — Amirali Zand",
  // A 404 has nothing worth indexing, and letting it into the index competes
  // with the two URLs that do matter.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div
      className={`${fontVariables} flex min-h-screen flex-col items-center justify-center gap-6 bg-void px-6 text-center`}
    >
      <p className="font-mono text-caption uppercase tracking-widest text-mist">404</p>
      <h1 className="font-display text-4xl text-ink md:text-6xl">This page doesn&apos;t exist</h1>
      <p className="max-w-md text-body text-mist">
        The link may be out of date, or the address mistyped. Everything on this site lives on one
        page.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="focus-ring rounded-pill bg-violet px-6 py-3 text-sm font-medium text-ink transition-colors duration-fast ease-brand hover:bg-violet-soft"
        >
          Go to the portfolio
        </Link>
        <Link
          href="/fa"
          className="focus-ring rounded-pill border border-line px-6 py-3 text-sm font-medium text-ink transition-colors duration-fast ease-brand hover:border-violet/50"
        >
          <span className="font-fa">نسخه فارسی</span>
        </Link>
      </div>
    </div>
  );
}

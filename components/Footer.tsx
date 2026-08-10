"use client";

import { Github, Terminal } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { XRAY_REGIONS } from "@/lib/xray";

/**
 * The page closes the way it opened: with facts rather than a signature.
 *
 * A colophon is the traditional place a book records how it was made, and for
 * a site whose whole argument is the craft of its own construction that is a
 * better ending than "© 2026 — all rights reserved". Everything here is a real
 * build fact, inlined at build time by next.config.js — the Next version and
 * the timestamp belong to the bundle actually being served, so this page can't
 * end on a claim it hasn't kept.
 */

/** Injected in next.config.js. The fallbacks only ever show if someone runs a
 *  bundler that skipped that config; a visible "—" is better than a crash. */
const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME;
const NEXT_VERSION = process.env.NEXT_PUBLIC_NEXT_VERSION;

const REPO_URL = "https://github.com/2az2000";

export function Footer() {
  const { t, locale } = useLanguage();

  const buildDate = BUILD_TIME
    ? new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(BUILD_TIME))
    : "—";

  const rows: { key: string; value: string }[] = [
    { key: t.footer.keys.framework, value: NEXT_VERSION ? `Next.js ${NEXT_VERSION}` : "Next.js" },
    { key: t.footer.keys.built, value: buildDate },
    { key: t.footer.keys.type, value: "Clash Display · General Sans · Peyda Pro · JetBrains Mono" },
    { key: t.footer.keys.fonts, value: t.footer.values.selfHosted },
    { key: t.footer.keys.motion, value: "GSAP · Framer Motion · Lenis" },
  ];

  return (
    <footer
      // Tagged directly rather than wrapped in page.tsx: it sits outside
      // <main>, and the wrapper there only covers the page's sections.
      data-xray={XRAY_REGIONS.footer.file}
      className="relative border-t border-line"
    >
      <div className="container py-12 md:py-16">
        <div className="glass overflow-hidden rounded-lg">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3 text-mist">
            <Terminal size={14} aria-hidden />
            <span className="caption">{t.footer.command}</span>
          </div>

          <dl className="grid gap-x-8 gap-y-3 p-5 font-mono text-xs sm:grid-cols-2">
            {rows.map((row) => (
              <div key={row.key} className="flex gap-3">
                <dt className="shrink-0 text-mist">{row.key}</dt>
                <dd
                  // The values are Latin technology names and version numbers;
                  // under RTL they would otherwise be reordered around the
                  // dots and spaces into something that is not a version.
                  dir="ltr"
                  className="min-w-0 flex-1 truncate text-ink rtl:text-end"
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-mist">{t.footer.rights}</p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded-pill border border-line px-3 py-1.5 font-mono text-xs text-mist transition-colors duration-fast ease-brand hover:border-violet/40 hover:text-ink"
          >
            <Github size={13} aria-hidden />
            {t.footer.source}
          </a>
        </div>
      </div>
    </footer>
  );
}

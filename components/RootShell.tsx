import type { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/components/Providers";
import { CustomCursor } from "@/components/CustomCursor";
import { AmbientBackground } from "@/components/AmbientBackground";
import type { Locale } from "@/lib/i18n";

/**
 * Everything the two root layouts have in common.
 *
 * There are two of them — `app/(en)/layout.tsx` and `app/(fa)/layout.tsx` —
 * because only a root layout may render `<html>`, and `lang`/`dir` have to be
 * correct in the server response for each locale. Making one shared layout
 * vary by route would mean reading `headers()`, which opts the whole site out
 * of static rendering to decide two attributes.
 *
 * The cost of that split is duplication, and this component is where it stops:
 * the font loaders in particular must be module-level singletons, and defining
 * them twice would emit two sets of @font-face rules and two preload chains.
 */

/**
 * Clash Display + General Sans, self-hosted.
 *
 * These are the exact same woff2 files Fontshare serves — same faces, same
 * weights, same rendering — but they used to arrive via a render-blocking
 * <link> to api.fontshare.com. Measured from Tehran that stylesheet alone
 * took ~3.7s of a 3.8s first contentful paint, and it gated the woff2 fetches
 * behind it because the browser can't discover cdn.fontshare.com until the
 * CSS parses. Every other resource on the page loads in about 30ms.
 *
 * Serving them from our own origin removes two third-party DNS+TCP+TLS
 * handshakes from the critical path, and next/font emits the @font-face and
 * preloads them at build time.
 */
const clashDisplay = localFont({
  src: [
    { path: "../app/fonts/ClashDisplay-600.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/ClashDisplay-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["sans-serif"],
});

const generalSans = localFont({
  src: [
    { path: "../app/fonts/GeneralSans-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/GeneralSans-500.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/GeneralSans-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["sans-serif"],
});

/**
 * Peyda Pro — all Persian text, headings and body alike (AGENTS.md §4).
 *
 * Self-hosted for the same reason as the two Latin faces above, and built
 * from the TTFs in `assets/fonts-src/Peyda Pro/` by subsetting them to Latin +
 * Arabic ranges the site actually uses and recompressing to woff2:
 * ~202KB per weight becomes ~28KB, so all four weights together cost less
 * than a third of one original file. Regenerate with:
 *
 *   python -m fontTools.subset "assets/fonts-src/Peyda Pro/Peyda-Regular.ttf" \
 *     --output-file=app/fonts/Peyda-400.woff2 --flavor=woff2 \
 *     --layout-features='*' --unicodes="U+0000-00FF,U+0600-06FF,..."
 *
 * `--layout-features='*'` is not optional: Arabic is a joining script, and
 * dropping init/medi/fina/rlig/ccmp would leave every Persian word rendered
 * as disconnected isolated letters.
 *
 * Only the four weights the site references are shipped (400 body, 500 for
 * the `font-medium` labels, 600, 700) — the family also has thin through
 * black, and nothing uses them.
 */
const peyda = localFont({
  src: [
    { path: "../app/fonts/Peyda-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/Peyda-500.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/Peyda-600.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/Peyda-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-fa",
  display: "swap",
  // No generic appended here: every Tailwind stack that consumes this
  // variable already ends in one, and a `sans-serif` buried mid-stack would
  // swallow glyphs meant for the faces listed after it.
});

// Labels, code, commit log, UI tags. Persian inside these is handled by the
// range-scoped "Peyda Arabic" face in globals.css, not here — next/font
// appends a metric-adjusted fallback built on local Arial to this family,
// and Arial carries Arabic, so Persian glyphs would otherwise stop there.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * The four font variable classes, as one string.
 *
 * Exported because `app/not-found.tsx` needs the same typography without the
 * rest of the shell: a root not-found sits above both route groups, and Next
 * supplies its own bare `<html>` for it, so that page applies these to a
 * wrapper element instead of to `<body>`. CSS variables cascade, so the
 * distinction does not matter to anything downstream.
 */
export const fontVariables = [
  clashDisplay.variable,
  generalSans.variable,
  peyda.variable,
  jetbrainsMono.variable,
].join(" ");

export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={fontVariables}>
        {/* Outside Providers on purpose: this is a persistent backdrop, so
            it shouldn't fade/flicker along with LanguageProvider's
            locale-switch cross-fade wrapper. */}
        <AmbientBackground />
        {/* Outside Providers for the same reason as the backdrop above: the
            cursor is chrome, not content, and inside LanguageProvider's
            cross-fade wrapper it faded to nothing on every locale toggle —
            leaving the page with no visible cursor at all, since we hide the
            native one. It consumes no context. */}
        <CustomCursor />
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}

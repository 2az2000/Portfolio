import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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
    { path: "./fonts/ClashDisplay-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ClashDisplay-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["sans-serif"],
});

const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GeneralSans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/GeneralSans-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["sans-serif"],
});
import { Providers } from "@/components/Providers";
import { CustomCursor } from "@/components/CustomCursor";
import { AmbientBackground } from "@/components/AmbientBackground";

/**
 * Peyda Pro — all Persian text, headings and body alike (AGENTS.md §4).
 *
 * Self-hosted for the same reason as the two Latin faces above, and built
 * from the TTFs in `public/Peyda Pro/` by subsetting them to the Latin +
 * Arabic ranges the site actually uses and recompressing to woff2:
 * ~202KB per weight becomes ~28KB, so all four weights together cost less
 * than a third of one original file. Regenerate with:
 *
 *   python -m fontTools.subset "public/Peyda Pro/Peyda-Regular.ttf" \
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
    { path: "./fonts/Peyda-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Peyda-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Peyda-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Peyda-700.woff2", weight: "700", style: "normal" },
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-amirali.vercel.app";

const TITLE = "Amirali Zand — Frontend Developer";
const DESCRIPTION =
  "Frontend Developer — React, Next.js, TypeScript & the Node.js ecosystem.";

/**
 * The favicon, the apple touch icon and the social card are the AZ mark, and
 * they're picked up from `app/icon.png`, `app/apple-icon.png` and
 * `app/opengraph-image.jpg` by Next's file conventions — which is also why
 * there's no `icons` key here. `metadataBase` is what turns those into the
 * absolute URLs crawlers require.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Amirali Zand",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    alternateLocale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${clashDisplay.variable} ${generalSans.variable} ${peyda.variable} ${jetbrainsMono.variable}`}
      >
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

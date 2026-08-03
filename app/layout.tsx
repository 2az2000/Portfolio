import type { Metadata } from "next";
import { Vazirmatn, JetBrains_Mono } from "next/font/google";
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

// Persian text (headings + body) — see AGENTS.md typography table.
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-fa",
  display: "swap",
});

// Labels, code, commit log, UI tags.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amirali Zand — Frontend Developer",
  description: "Frontend Developer — React, Next.js, TypeScript & the Node.js ecosystem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${clashDisplay.variable} ${generalSans.variable} ${vazirmatn.variable} ${jetbrainsMono.variable}`}
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

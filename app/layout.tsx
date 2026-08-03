import type { Metadata } from "next";
import { Vazirmatn, JetBrains_Mono } from "next/font/google";
import "./globals.css";
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
      <head>
        {/* Display + body Latin faces are loaded from Fontshare — see
            AGENTS.md §4. next/font doesn't proxy Fontshare, so these stay
            as plain <link> tags. */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=general-sans@400,500,600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-display: 'Clash Display', sans-serif;
            --font-body: 'General Sans', sans-serif;
          }
        `}</style>
      </head>
      <body className={`${vazirmatn.variable} ${jetbrainsMono.variable}`}>
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

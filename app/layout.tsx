import type { Metadata } from "next";
import { Vazirmatn, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { CustomCursor } from "@/components/CustomCursor";

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
    <html lang="fa" dir="rtl" suppressHydrationWarning>
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
        <Providers>
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}

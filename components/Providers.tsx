"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SmoothScroll } from "@/components/SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {/* Renders nothing; owns the page's scroll behaviour. Mounted here so
          it sits inside the client boundary but outside LanguageProvider's
          cross-fade wrapper's content — it has no DOM of its own to fade. */}
      <SmoothScroll />
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}

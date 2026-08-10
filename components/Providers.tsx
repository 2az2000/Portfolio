"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeWipe } from "@/components/ThemeWipe";
import { XRayProvider } from "@/components/XRayProvider";
import { XRayLegend } from "@/components/XRayLegend";
import { CommandPalette } from "@/components/ui/CommandPalette";

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
      {/* Outside LanguageProvider's cross-fade wrapper: it is a fixed overlay
          that must not fade along with the page during a locale swap. It has
          no text, so it needs no dictionary. */}
      <ThemeWipe />
      {/* Inside LanguageProvider because the legend's copy is translated —
          the whole point of X-ray mode is explaining the page, and an
          explanation only lands in the reader's own language. */}
      <LanguageProvider>
        <XRayProvider>
          {children}
          <XRayLegend />
          {/* Inside XRayProvider because one of its rows toggles that mode —
              the only way into it on a device with no keyboard. */}
          <CommandPalette />
        </XRayProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

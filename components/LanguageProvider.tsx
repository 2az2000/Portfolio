"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useAnimation } from "framer-motion";
import { dictionaries, type Dictionary, type Locale } from "@/lib/i18n";
import { DURATION, EASE_BRAND, prefersReducedMotion } from "@/lib/theme";

type LanguageContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: Dictionary;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "portfolio-locale";
const dirOf = (locale: Locale): "rtl" | "ltr" => (locale === "fa" ? "rtl" : "ltr");

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Defaults to English; swaps instantly on mount if storage says otherwise.
  const [locale, setLocaleState] = useState<Locale>("en");
  const isFirstLocaleChange = useRef(true);
  const controls = useAnimation();

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "en" || stored === "fa") setLocaleState(stored);
  }, []);

  // Cross-fade the content in place on every locale change after the
  // initial mount. This intentionally does NOT remount the tree (no
  // `key={locale}` on a wrapping AnimatePresence, unlike before) — keying
  // the whole app by locale tore down and rebuilt every GSAP ScrollTrigger,
  // the Spline WebGL context, and every IntersectionObserver on each
  // toggle, and that teardown/rebuild race is what left the page blank
  // until a hard refresh.
  //
  // The `dir`/`lang` attribute flip (and the RTL font swap in globals.css)
  // triggers an instant, untransitioned reflow, so it's sequenced to land
  // while the content is fully invisible (opacity 0, not a partial dip) —
  // otherwise the direction/font snap is still visible mid-fade and reads
  // as a jarring jump.
  useEffect(() => {
    if (isFirstLocaleChange.current) {
      isFirstLocaleChange.current = false;
      document.documentElement.lang = locale;
      document.documentElement.dir = dirOf(locale);
      return;
    }

    if (prefersReducedMotion()) {
      document.documentElement.lang = locale;
      document.documentElement.dir = dirOf(locale);
      controls.set({ opacity: 1 });
      return;
    }

    let cancelled = false;
    (async () => {
      await controls.start({
        opacity: 0,
        transition: { duration: DURATION.fast, ease: EASE_BRAND },
      });
      if (cancelled) return;
      document.documentElement.lang = locale;
      document.documentElement.dir = dirOf(locale);
      await controls.start({
        opacity: 1,
        transition: { duration: DURATION.base, ease: EASE_BRAND },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [locale, controls]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "fa" ? "en" : "fa");
  }, [locale, setLocale]);

  const value: LanguageContextValue = {
    locale,
    dir: dirOf(locale),
    t: dictionaries[locale],
    toggleLocale,
    setLocale,
  };

  return (
    <LanguageContext.Provider value={value}>
      {/* Cross-fade on locale change instead of an abrupt text/direction
          jump — this transition IS one of the signature details called out
          in AGENTS.md §3.7. Not keyed by locale: the tree stays mounted so
          GSAP/Spline/observers survive the toggle (see effect above). */}
      <motion.div animate={controls}>{children}</motion.div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage() must be used inside <LanguageProvider>");
  }
  return ctx;
}

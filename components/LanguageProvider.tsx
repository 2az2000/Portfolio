"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { dictionaries, type Dictionary, type Locale } from "@/lib/i18n";
import { DURATION, EASE_BRAND } from "@/lib/theme";

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
  // Defaults to Persian; swaps instantly on mount if the browser/storage says otherwise.
  const [locale, setLocaleState] = useState<Locale>("fa");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "en" || stored === "fa") setLocaleState(stored);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dirOf(locale);
  }, [locale]);

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
      {/* Cross-fade the whole tree on locale change instead of an abrupt
          text/direction jump — this transition IS one of the signature
          details called out in AGENTS.md §3.7. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={locale}
          initial={{ opacity: isHydrated ? 0 : 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE_BRAND }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
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

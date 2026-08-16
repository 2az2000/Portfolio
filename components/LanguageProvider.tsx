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
import { LocaleCurtain } from "@/components/LocaleCurtain";

type LanguageContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  /** True while the curtain is covering the page mid-swap — lets the toggle
   *  in the navbar lock itself instead of queueing a second transition. */
  isSwapping: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "portfolio-locale";
const dirOf = (locale: Locale): "rtl" | "ltr" => (locale === "fa" ? "rtl" : "ltr");
const pathOf = (locale: Locale): string => (locale === "fa" ? "/fa" : "/");

/**
 * Points the address bar at the locale now on screen without navigating.
 *
 * A real navigation would remount the tree — see the note on setLocale below
 * for why that is fatal here. `replaceState` rather than `pushState` so the
 * back button still means "the page before this site", not "undo one of the
 * six times I toggled the language".
 */
function syncUrl(locale: Locale) {
  const next = pathOf(locale) + window.location.search + window.location.hash;
  if (next !== window.location.pathname + window.location.search + window.location.hash) {
    window.history.replaceState(null, "", next);
  }
}

/** Must match the sheet's sweep-in duration in LocaleCurtain — the language
 *  swap lands the moment the page is fully covered, never a frame before. */
const COVER_MS = 560;

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  /** The locale the route already server-rendered. */
  initialLocale: Locale;
}) {
  // Seeded from the route, so the first client render agrees with the HTML the
  // server sent and there is no post-hydration language flip to hide.
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [curtainTarget, setCurtainTarget] = useState<Locale>(initialLocale);
  const [isSwapping, setIsSwapping] = useState(false);
  const swapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controls = useAnimation();

  /**
   * The stored preference only gets a say on `/`, which is the neutral entry
   * point. A visitor who typed or was linked `/fa` asked for Persian in the
   * URL, and an old localStorage value overriding that would make shared links
   * resolve differently for different people — the one thing a URL must not do.
   */
  useEffect(() => {
    if (initialLocale !== "en") {
      window.localStorage.setItem(STORAGE_KEY, initialLocale);
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "fa") {
      setLocaleState("fa");
      setCurtainTarget("fa");
      syncUrl("fa");
    }
  }, [initialLocale]);

  // Keep the document attributes in sync on first paint (and on any swap that
  // bypassed the animation, e.g. reduced motion). The animated path sets them
  // itself, mid-curtain — see setLocale below.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dirOf(locale);
  }, [locale]);

  useEffect(
    () => () => {
      if (swapTimeoutRef.current) clearTimeout(swapTimeoutRef.current);
    },
    []
  );

  /**
   * The signature transition (AGENTS.md §3.7). Sequence:
   *
   *   0ms      curtain starts sweeping in, in the reading direction of the
   *            language being switched to; content fades out beneath it
   *   ~560ms   page is fully covered — only now does the dictionary swap and
   *            the `dir`/`lang`/font flip happen, so the untransitionable
   *            reflow they cause is never visible
   *   ~560ms+  curtain sweeps onward off the far edge, uncovering content
   *            that is already fading back in
   *
   * The tree is deliberately never remounted (no `key={locale}`): keying the
   * app by locale tore down every GSAP ScrollTrigger, the Spline WebGL
   * context and every IntersectionObserver on each toggle, and that
   * teardown/rebuild race is what used to leave the page blank until a hard
   * refresh.
   *
   * That is also why this never routes to the other locale even though both
   * `/` and `/fa` exist. Those routes are how a crawler — and anyone opening a
   * shared link — gets server-rendered content in the right language. The
   * toggle only has to make the address bar agree with what is on screen, and
   * `replaceState` does that without unmounting anything.
   */
  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale || swapTimeoutRef.current) return;
      window.localStorage.setItem(STORAGE_KEY, next);
      syncUrl(next);

      if (prefersReducedMotion()) {
        setLocaleState(next);
        controls.set({ opacity: 1 });
        return;
      }

      setCurtainTarget(next);
      setIsSwapping(true);
      controls.start({
        opacity: 0,
        transition: { duration: DURATION.fast, ease: EASE_BRAND, delay: 0.18 },
      });

      swapTimeoutRef.current = setTimeout(() => {
        swapTimeoutRef.current = null;
        setLocaleState(next);
        setIsSwapping(false);
        // Fades back in *while* the curtain is still leaving, so its trailing
        // edge uncovers content that is already on its way in rather than a
        // blank page that starts fading only once the wipe has finished.
        controls.start({
          opacity: 1,
          transition: { duration: DURATION.base, ease: EASE_BRAND, delay: 0.12 },
        });
      }, COVER_MS);
    },
    [locale, controls]
  );

  const value: LanguageContextValue = {
    locale,
    dir: dirOf(locale),
    t: dictionaries[locale],
    setLocale,
    isSwapping,
  };

  return (
    <LanguageContext.Provider value={value}>
      {/* Opacity only — never transform or filter. Both would turn this
          wrapper into the containing block for every `position: fixed`
          descendant (the navbar, the custom cursor), which would tear them
          off the viewport for the length of the transition. */}
      <motion.div animate={controls}>{children}</motion.div>

      {/* Rendered outside that wrapper for the same reason: the curtain is a
          fixed, full-viewport layer and must not inherit its animation. */}
      <LocaleCurtain active={isSwapping} target={curtainTarget} />
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

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/LanguageProvider";
import { EASE_BRAND, DURATION } from "@/lib/theme";
import { scrollToId, scrollToTop } from "@/lib/smoothScroll";

/** Each language labelled in Latin script so both segments stay legible in
 *  either direction — the switcher has to be readable to someone who cannot
 *  read the language they are switching away from. */
const LOCALES = [
  { code: "en" as const, label: "EN" },
  { code: "fa" as const, label: "FA" },
];

const navSections = [
  { id: "about", key: "about" as const },
  { id: "skills", key: "skills" as const },
  { id: "projects", key: "projects" as const },
  { id: "case-studies", key: "caseStudies" as const },
  { id: "experience", key: "experience" as const },
  { id: "contact", key: "contact" as const },
];

export function Navbar() {
  const { locale, setLocale, isSwapping, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navSections.map((s) => document.getElementById(s.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Routed through the shared helper rather than scrollIntoView: the page is
  // driven by Lenis, and a native smooth scroll would animate the same
  // scrollTop at the same time (see lib/smoothScroll.ts).
  const scrollTo = useCallback(
    (id: string) => {
      scrollToId(id);
      closeMobile();
    },
    [closeMobile]
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-base ease-brand ${
          scrolled
            ? "glass shadow-glass"
            : "bg-transparent"
        }`}
      >
        <nav className="container flex items-center justify-between py-4">
          {/* Logo */}
          <button
            onClick={scrollToTop}
            className="focus-ring group -ms-2 rounded-lg"
            aria-label="Scroll to top"
          >
            {/* The mark is a dark 3D render, so it needs a surface to sit on:
                against the light theme it would otherwise float on bare
                white, and against the dark one its edges dissolve into the
                page. The tile is the same `glass` used by the controls on the
                other end of the bar, which also keeps both ends of the navbar
                on one material. */}
            <span className="glass relative flex items-center justify-center rounded-lg px-2.5 py-1.5 transition-all duration-fast ease-brand group-hover:border-violet/30 group-hover:shadow-glow">
              {/* Soft violet bloom under the mark. Always on, but faint —
                  it lifts the logo off the tile without reading as a second
                  glow next to the hover state. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-1 rounded-lg bg-violet/20 blur-md transition-opacity duration-fast ease-brand group-hover:opacity-80"
              />
              {/* A plain <img> for the same reason as the project marks: a
                  3.7KB 96px asset gains nothing from a round trip through the
                  image optimizer. Intrinsic size is declared so the row never
                  reflows once it decodes, and `alt` is empty because the
                  button already carries the label. */}
              <img
                src="/images/amirali-96.webp"
                alt=""
                width={96}
                height={96}
                // The one image on the page above the fold in every viewport —
                // the only place on this site where eager beats lazy.
                fetchPriority="high"
                decoding="async"
                className="relative h-8 w-auto transition-transform duration-fast ease-brand group-hover:scale-110"
              />
            </span>
          </button>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navSections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollTo(section.id)}
                  className={`relative rounded-lg px-3 py-2 font-mono text-caption uppercase transition-colors duration-fast focus-ring ${
                    active === section.id
                      ? "text-ink"
                      : "text-mist hover:text-ink"
                  }`}
                >
                  {active === section.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-white/[0.08]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{t.nav[section.key]}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Right side: theme toggle + language toggle + mobile menu button */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="focus-ring glass flex h-9 w-9 items-center justify-center rounded-pill text-ink transition-all duration-fast hover:bg-white/[0.08]"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    transition={{ duration: DURATION.fast, ease: EASE_BRAND }}
                  >
                    {theme === "dark" ? <Sun size={16} className="text-amber" /> : <Moon size={16} className="text-violet" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            )}

            {/* A segmented control rather than a blind toggle: both languages
                are visible, so the choice is legible before it is made. Pinned
                LTR so the two segments keep the same physical order across the
                direction flip — a control that swaps sides at the moment you
                use it reads as a bug. */}
            <div
              dir="ltr"
              role="group"
              aria-label="Language"
              className="glass flex items-center rounded-pill p-1"
            >
              <Languages size={14} className="mx-1.5 shrink-0 text-violet" aria-hidden />
              {LOCALES.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLocale(code)}
                  // Locked mid-sweep: a second swap queued behind the curtain
                  // would flip the direction twice under one cover.
                  disabled={isSwapping}
                  aria-pressed={locale === code}
                  className={`focus-ring relative rounded-pill px-2.5 py-1 font-mono text-xs uppercase transition-colors duration-fast ${
                    locale === code ? "text-ink" : "text-mist hover:text-ink"
                  }`}
                >
                  {locale === code && (
                    <motion.span
                      layoutId="locale-thumb"
                      className="absolute inset-0 rounded-pill border border-violet/40 bg-violet/20"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="focus-ring glass flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-all duration-fast hover:bg-white/[0.08] md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "menu"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: DURATION.fast, ease: EASE_BRAND }}
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE_BRAND }}
            className="fixed inset-0 z-40 bg-void/80 backdrop-blur-sm md:hidden"
            onClick={closeMobile}
          >
            <motion.ul
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: DURATION.base, ease: EASE_BRAND }}
              className="container flex flex-col gap-1 pt-24"
              onClick={(e) => e.stopPropagation()}
            >
              {navSections.map((section, i) => (
                <motion.li
                  key={section.id}
                  // Slides in from the inline-start edge, so the direction
                  // has to follow the locale rather than always being left.
                  initial={{ opacity: 0, x: locale === "fa" ? 12 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: DURATION.base,
                    ease: EASE_BRAND,
                    delay: i * 0.06,
                  }}
                >
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={`w-full rounded-xl px-5 py-3.5 text-start font-mono text-caption uppercase transition-colors duration-fast focus-ring ${
                      active === section.id
                        ? "glass-strong text-ink"
                        : "text-mist hover:bg-white/[0.04] hover:text-ink"
                    }`}
                  >
                    <span className="text-violet me-2 opacity-60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {t.nav[section.key]}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/LanguageProvider";
import { EASE_BRAND, DURATION } from "@/lib/theme";

const navSections = [
  { id: "about", key: "about" as const },
  { id: "skills", key: "skills" as const },
  { id: "projects", key: "projects" as const },
  { id: "playground", key: "playground" as const },
  { id: "experience", key: "experience" as const },
  { id: "contact", key: "contact" as const },
];

export function Navbar() {
  const { locale, toggleLocale, t } = useLanguage();
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

  const scrollTo = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-display text-xl text-ink transition-colors duration-fast hover:text-violet focus-ring rounded-lg px-2 py-1 -ml-2"
            aria-label="Scroll to top"
          >
            AZ
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

            <button
              onClick={toggleLocale}
              className="focus-ring glass flex items-center gap-2 rounded-pill px-3 py-1.5 text-sm text-ink transition-all duration-fast hover:bg-white/[0.08] hover:shadow-glow"
              aria-label="Toggle language"
            >
              <Languages size={14} className="text-violet" />
              <motion.span
                key={locale}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.fast, ease: EASE_BRAND }}
                className="font-mono uppercase"
              >
                {locale}
              </motion.span>
            </button>

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
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: DURATION.base,
                    ease: EASE_BRAND,
                    delay: i * 0.06,
                  }}
                >
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={`w-full rounded-xl px-5 py-3.5 text-left font-mono text-caption uppercase transition-colors duration-fast focus-ring ${
                      active === section.id
                        ? "glass-strong text-ink"
                        : "text-mist hover:bg-white/[0.04] hover:text-ink"
                    }`}
                  >
                    <span className="text-violet mr-2 opacity-60">
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

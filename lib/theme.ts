/**
 * Single source of truth for motion values, mirroring the tokens in
 * tailwind.config.ts. GSAP timelines must import from here instead of
 * hardcoding numbers, so every animation in the project (CSS, Framer
 * Motion, GSAP) shares the exact same easing and rhythm.
 */

export const EASE_BRAND = [0.16, 1, 0.3, 1] as const; // for Framer Motion
export const EASE_BRAND_CSS = "cubic-bezier(0.16, 1, 0.3, 1)"; // for GSAP / CSS

export const DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 1.2,
} as const;

export const STAGGER_BASE = 0.08;

/** Brand color values as raw hex, for use in canvas/SVG/GSAP where Tailwind
 *  classes aren't available (e.g. drawing constellation lines). */
export const COLORS = {
  void: "#0A0A0F",
  surface: "#12121A",
  ink: "#F5F5F7",
  mist: "#9A9AB0",
  violet: "#7C5CFC",
  violetSoft: "#A493FF",
  mint: "#33E6B8",
  mintSoft: "#8FF5D9",
  amber: "#FFB86B",
  line: "rgba(255,255,255,0.08)",
} as const;

/** Framer Motion variant presets reused across sections so entrances feel
 *  identical everywhere. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_BRAND },
  },
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: STAGGER_BASE },
  },
};

/** Returns true if the user has requested reduced motion. Read this before
 *  starting any GSAP timeline or Framer Motion sequence that isn't a plain
 *  fade. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

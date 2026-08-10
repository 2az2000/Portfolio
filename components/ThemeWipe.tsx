"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_BRAND } from "@/lib/theme";
import {
  applyThemeClass,
  endThemeWipe,
  setThemeWipeListener,
  type ThemeWipeRequest,
} from "@/lib/themeWipe";

/**
 * Paints the theme switch: a circle in the colour of the theme being switched
 * *to* grows out of the control that was used, and once it has the page
 * covered — and only then — the theme actually flips underneath, so the
 * untransitionable moment where every token changes at once is never on
 * screen. The circle then fades, uncovering a page that is already the new
 * theme.
 *
 * Same three beats as the language curtain: cover, swap, uncover. See
 * lib/themeWipe.ts for why this is hand-drawn rather than a View Transition.
 *
 * Everything animated here is transform and opacity on one `fixed`,
 * `pointer-events: none` layer, so it composites on the GPU, never reflows
 * the page beneath it, and leaves the page clickable the whole time.
 */

/**
 * Cover. Longer than it first looks like it needs: `ease-brand` is an expo-out
 * that covers ~93% of the distance in the first 30% of its duration, so at a
 * shorter setting the circle was effectively shut before it had visibly
 * travelled and the effect read as a flash rather than a wipe. This gives the
 * edge enough time on screen to be seen crossing the page.
 */
const COVER_SECONDS = 0.42;
/** Uncover. Slightly quicker than the cover — it is fading a flat colour off
 *  content that is already correct underneath, so there is nothing to wait
 *  for once it starts. */
const REVEAL_SECONDS = 0.38;

type Phase = "covering" | "revealing";

export function ThemeWipe() {
  const [request, setRequest] = useState<ThemeWipeRequest | null>(null);
  const [phase, setPhase] = useState<Phase>("covering");

  useEffect(() => {
    const unsubscribe = setThemeWipeListener((next) => {
      setPhase("covering");
      setRequest(next);
    });
    return () => {
      unsubscribe();
      // Unmounting mid-wipe would otherwise leave the module's busy flag set
      // and every later switch would silently fall back to an instant swap.
      endThemeWipe();
    };
  }, []);

  if (!request) return null;

  const { id, theme, x, y, radius } = request;
  const size = radius * 2;

  return (
    <AnimatePresence
      onExitComplete={() => {
        setRequest(null);
        endThemeWipe();
      }}
    >
      {phase === "covering" && (
        <motion.div
          key={id}
          aria-hidden
          data-theme-wipe={theme}
          // The target theme's class scopes its palette to this subtree, so
          // the circle can read `bg-void` — the page colour it is standing in
          // for — while the document is still showing the other theme. That
          // is why `.light` is a scopable selector in globals.css.
          className={`${theme} pointer-events-none fixed inset-0 z-[90] overflow-hidden`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: REVEAL_SECONDS, ease: EASE_BRAND }}
        >
          <motion.span
            className="absolute rounded-full bg-void"
            style={{ width: size, height: size, left: x - radius, top: y - radius }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: COVER_SECONDS, ease: EASE_BRAND }}
            onAnimationComplete={() => {
              // The page is fully hidden at exactly this frame, which is the
              // only safe moment to swap: `applyThemeClass` is instant, and
              // `commit` re-renders every useTheme() consumer behind the
              // cover where the work is invisible.
              applyThemeClass(theme);
              request.commit(theme);
              setPhase("revealing");
            }}
          />

          {/* A brand-tinted rim riding the leading edge, so the circle arrives
              as a deliberate wipe rather than as a plain expanding disc — the
              same trick as the locale curtain's aurora blade. Drawn as a ring
              inside the circle's own bounds so it costs no extra layer. */}
          <motion.span
            className="absolute rounded-full ring-1 ring-violet/40"
            style={{ width: size, height: size, left: x - radius, top: y - radius }}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: COVER_SECONDS, ease: EASE_BRAND }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

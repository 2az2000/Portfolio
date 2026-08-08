"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type Locale } from "@/lib/i18n";
import { EASE_BRAND } from "@/lib/theme";

/**
 * The full-screen wipe that covers the page while the locale swaps
 * (AGENTS.md §3.7 — the language switch is a showcased feature, not a
 * hidden utility).
 *
 * The panel travels in the reading direction of the language being switched
 * *to*: going to Persian it sweeps right-to-left, going back to English it
 * sweeps left-to-right. That is the whole point of the effect — the motion
 * itself announces which way the page is about to read, so the `dir` flip
 * that happens behind it reads as intentional rather than as a glitch.
 *
 * Everything is a transform/opacity animation on a `fixed` layer, so it
 * composites on the GPU and never reflows the page underneath mid-swap.
 */

/** How far past the viewport the panel starts/ends — a hair over 100% so no
 *  sub-pixel seam is ever visible at the leading edge. */
const OFFSCREEN = "105%";

export function LocaleCurtain({ active, target }: { active: boolean; target: Locale }) {
  // Persian reads right-to-left, so its curtain enters from the right edge.
  const fromRight = target === "fa";
  const enterFrom = fromRight ? OFFSCREEN : `-${OFFSCREEN}`;
  const exitTo = fromRight ? `-${OFFSCREEN}` : OFFSCREEN;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          // Pinned LTR: this layer is positioned by physical x, and it is
          // animating *across* a direction change — inheriting `dir` would
          // flip its own coordinate system halfway through the sweep.
          dir="ltr"
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
        >
          {/* Trailing sheet: solid page colour, so whatever the wipe has
              already passed over is genuinely hidden while the DOM's
              direction attribute flips behind it. */}
          <motion.div
            className="absolute inset-0 bg-void"
            initial={{ x: enterFrom }}
            animate={{ x: 0 }}
            exit={{ x: exitTo }}
            transition={{ duration: 0.55, ease: EASE_BRAND }}
          />

          {/* Leading edge: a thin aurora band that runs a step ahead of the
              sheet, so the wipe arrives as a bright brand-coloured blade
              rather than as a plain black rectangle. */}
          <motion.div
            className="absolute inset-y-0 w-[18vw] bg-aurora opacity-90 blur-2xl"
            style={{ [fromRight ? "right" : "left"]: 0 }}
            initial={{ x: fromRight ? "120vw" : "-120vw" }}
            animate={{ x: fromRight ? "-100vw" : "100vw" }}
            exit={{ x: fromRight ? "-120vw" : "120vw" }}
            transition={{ duration: 0.72, ease: EASE_BRAND }}
          />

          {/* The locale being switched to, stamped across the covered page.
              It rides in with the sheet and leaves with it, which is what
              makes the swap feel deliberate instead of like a loading gap. */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.4, ease: EASE_BRAND, delay: 0.12 }}
          >
            <span className="font-mono text-hero uppercase tracking-widest text-ink/90">
              {target}
            </span>
            <span
              className="absolute mt-[9rem] font-mono text-caption uppercase tracking-widest text-mist"
              // Not from the dictionary on purpose: mid-swap the dictionary
              // is in the language being left behind, and this label belongs
              // to the one being entered. Locale names are written in their
              // own language by convention anyway.
            >
              {target === "fa" ? "فارسی · راست به چپ" : "English · left to right"}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

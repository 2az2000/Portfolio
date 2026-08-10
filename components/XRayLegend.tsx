"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScanLine, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useXRay } from "@/components/XRayProvider";
import { DURATION, EASE_BRAND } from "@/lib/theme";
import {
  XRAY_BEHAVIORAL,
  XRAY_BEHAVIORAL_IDS,
  XRAY_REGIONS,
  XRAY_REGION_IDS,
} from "@/lib/xray";

/** Far enough down that the hint never competes with the hero for attention. */
const HINT_SCROLL_THRESHOLD = 400;
/** …and gone again before it reaches the footer, whose own link sits in the
 *  same corner. */
const HINT_FOOTER_MARGIN = 260;

/**
 * The two pieces of chrome X-ray mode owns: the panel that explains what the
 * outlines mean, and the one-line hint that tells a desktop visitor the mode
 * exists at all.
 *
 * The panel carries the half of the story the outlines can't. An outline can
 * say "this box is Projects.tsx"; it can't say the cards enter on a
 * ScrollTrigger.batch with a spring pop while the timeline next to them is
 * scrubbed. And it has nothing at all to say about the cursor, the locale
 * curtain or the scroll driver, which are the parts a visitor has been
 * feeling for the whole visit without being able to point at them.
 */
export function XRayLegend() {
  const { t, dir } = useLanguage();
  const { enabled, setEnabled } = useXRay();

  return (
    <>
      <AnimatePresence>
        {enabled && (
          <motion.aside
            key="xray-legend"
            dir={dir}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: DURATION.base, ease: EASE_BRAND }}
            // Scrolls its own overflow on a short viewport; without this Lenis
            // hands the wheel to the page behind it once the list bottoms out.
            data-lenis-prevent
            className="glass-strong no-scrollbar fixed inset-x-4 bottom-4 z-[60] max-h-[60vh] overflow-y-auto rounded-lg p-5 shadow-glass sm:inset-x-auto sm:end-6 sm:w-[26rem]"
            aria-label={t.xray.title}
          >
            <header className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 font-mono text-caption uppercase text-violet dark:text-violet-soft">
                  <ScanLine size={13} aria-hidden />
                  {t.xray.title}
                </p>
                <p className="mt-1.5 text-sm text-mist">{t.xray.description}</p>
              </div>
              <button
                onClick={() => setEnabled(false)}
                aria-label={t.xray.close}
                className="focus-ring -me-1 -mt-1 shrink-0 rounded-lg p-1.5 text-mist transition-colors duration-fast hover:text-ink"
              >
                <X size={16} />
              </button>
            </header>

            <LegendGroup label={t.xray.regionsLabel}>
              {XRAY_REGION_IDS.map((id) => (
                <LegendRow
                  key={id}
                  path={XRAY_REGIONS[id].path}
                  note={t.xray.regions[id]}
                />
              ))}
            </LegendGroup>

            <LegendGroup label={t.xray.behavioralLabel}>
              {XRAY_BEHAVIORAL_IDS.map((id) => (
                <LegendRow
                  key={id}
                  path={XRAY_BEHAVIORAL[id].path}
                  note={t.xray.behavioral[id]}
                  behavioral
                />
              ))}
            </LegendGroup>

            <p className="mt-4 border-t border-line pt-3 font-mono text-xs text-mist">
              {t.xray.exit}
            </p>
          </motion.aside>
        )}
      </AnimatePresence>

      <XRayHint />
    </>
  );
}

function LegendGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-4 last:mb-0">
      <h3 className="caption mb-2">{label}</h3>
      <ul className="space-y-2">{children}</ul>
    </section>
  );
}

function LegendRow({
  path,
  note,
  behavioral,
}: {
  path: string;
  note: string;
  /** Draws the rule dashed instead of solid — the same "this has no box"
   *  language as the dashed outlines the mode paints on the page itself. */
  behavioral?: boolean;
}) {
  return (
    <li
      className={`border-s ps-3 text-start ${
        behavioral ? "border-dashed border-violet/40" : "border-line"
      }`}
    >
      <p
        className="font-mono text-xs text-violet dark:text-violet-soft"
        // The paths are Latin file names; under RTL they would otherwise be
        // reordered around the slashes into something that is not a path.
        dir="ltr"
      >
        {path}
      </p>
      <p className="mt-0.5 text-xs leading-relaxed text-mist">{note}</p>
    </li>
  );
}

/**
 * A feature nobody is told about is a feature nobody uses. This is the
 * smallest honest pointer at the keyboard shortcut: it waits until the
 * visitor has actually started reading, appears only where a keyboard exists,
 * and leaves permanently the first time the mode is opened.
 */
function XRayHint() {
  const { t } = useLanguage();
  const { enabled } = useXRay();
  const [visible, setVisible] = useState(false);
  const [used, setUsed] = useState(false);

  useEffect(() => {
    if (enabled) setUsed(true);
  }, [enabled]);

  useEffect(() => {
    // No keyboard, no shortcut worth advertising — and on a coarse pointer the
    // chip would just be clutter over the content.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onScroll = () => {
      const scrolled = window.scrollY;
      const remaining =
        document.documentElement.scrollHeight - scrolled - window.innerHeight;
      setVisible(scrolled > HINT_SCROLL_THRESHOLD && remaining > HINT_FOOTER_MARGIN);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && !enabled && !used && (
        <motion.div
          key="xray-hint"
          aria-hidden
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: DURATION.base, ease: EASE_BRAND }}
          // Bottom-end, which is exactly where the legend panel opens: the
          // hint stands in for the thing it announces rather than pointing at
          // it from across the viewport. (It also keeps clear of the Next dev
          // indicator, which is pinned bottom-left.)
          className="glass pointer-events-none fixed bottom-5 end-5 z-[55] hidden items-center gap-2 rounded-pill px-3 py-1.5 font-mono text-xs text-mist md:flex"
        >
          <kbd className="rounded border border-line px-1.5 py-0.5 text-violet-soft">X</kbd>
          {t.xray.hint}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

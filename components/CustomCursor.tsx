"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Elements the ring snaps around, tracing their actual shape. */
const SNAP_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary, [data-cursor="snap"]';
/** Big surfaces (the project/experience cards) — framing these would read as
 *  a border on the card rather than as a cursor, so they just widen the ring. */
const BLOB_SELECTOR = '[data-cursor="magnetic"]';
/** Past this, a snapped frame stops looking like a cursor. */
const MAX_SNAP = 460;

const RING_IDLE = 34;
const RING_BLOB = 68;
const SNAP_PAD = 10;

type Mode = "idle" | "blob" | "snap";

/**
 * Two-part cursor: a hard dot that tracks the pointer exactly, and a ring
 * that lags behind on a softer spring. Over anything clickable the ring stops
 * trailing and snaps onto the element — matching its box and its corner
 * radius — so the cursor is also a hit-target preview.
 *
 * Desktop pointers only, and never under prefers-reduced-motion (AGENTS.md §6),
 * since the whole thing is lag and easing.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [pressed, setPressed] = useState(false);

  // The element the ring is currently locked onto, kept so it can be
  // re-measured when the page scrolls underneath a stationary pointer.
  const snapElRef = useRef<HTMLElement | null>(null);
  // That element's own corner radius, cached. Reading it costs a style
  // recalc, and a magnetic button slides under the pointer every frame — so
  // the box has to be re-measured continuously while the radius cannot have
  // changed. Re-reading it anyway was a forced recalc on every frame of
  // every hover.
  const snapRadiusRef = useRef(0);
  const pointerRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  // Mirrors `visible` so the move handler can skip the setState entirely
  // once the cursor is on screen, instead of dispatching an identical value
  // on every pointer event and leaning on React's bail-out.
  const visibleRef = useRef(false);

  // Every spring below is damped to ζ ≈ 1 (c ≈ 2·√(k·m)) — the point where
  // it arrives as fast as it can without overshooting. The ring used to sit
  // just under that, so each movement ended in a small bounce, and the dot
  // just over it, which reads as drag. Neither is what a cursor should do.
  const px = useMotionValue(-100);
  const py = useMotionValue(-100);
  const dotX = useSpring(px, { damping: 28, stiffness: 1200, mass: 0.16 });
  const dotY = useSpring(py, { damping: 28, stiffness: 1200, mass: 0.16 });

  const rx = useMotionValue(-100);
  const ry = useMotionValue(-100);
  const ringX = useSpring(rx, { damping: 28, stiffness: 210, mass: 0.85 });
  const ringY = useSpring(ry, { damping: 28, stiffness: 210, mass: 0.85 });

  const w = useMotionValue(RING_IDLE);
  const h = useMotionValue(RING_IDLE);
  const r = useMotionValue(999);
  const ringW = useSpring(w, { damping: 26, stiffness: 330, mass: 0.5 });
  const ringH = useSpring(h, { damping: 26, stiffness: 330, mass: 0.5 });
  const ringR = useSpring(r, { damping: 26, stiffness: 330, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduced);
  }, []);

  // Only hide the native cursor once ours is actually running — if this
  // component never mounts (touch, reduced motion, JS off) the real cursor
  // has to stay exactly where it was.
  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    return () => root.classList.remove("has-custom-cursor");
  }, [enabled]);

  /**
   * Pins the ring to an element's box. `measureRadius` is true only when the
   * ring arrives on a *different* element — while it stays on one, the box is
   * re-read every frame (magnetic buttons move) but the radius is not.
   */
  const lockTo = useCallback(
    (el: HTMLElement, measureRadius: boolean) => {
      if (measureRadius) {
        snapRadiusRef.current = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      }

      const rect = el.getBoundingClientRect();
      rx.set(rect.left + rect.width / 2);
      ry.set(rect.top + rect.height / 2);
      w.set(rect.width + SNAP_PAD);
      h.set(rect.height + SNAP_PAD);

      // Follow the element's own corner radius so pills stay pills, but never
      // exceed a half-height (which would bulge a wide box into a lozenge).
      r.set(Math.min(snapRadiusRef.current + SNAP_PAD / 2, (rect.height + SNAP_PAD) / 2));
    },
    [rx, ry, w, h, r]
  );

  useEffect(() => {
    if (!enabled) return;

    const resolve = (target: HTMLElement) => {
      const snap = target.closest<HTMLElement>(SNAP_SELECTOR);
      if (snap) {
        const rect = snap.getBoundingClientRect();
        if (rect.width <= MAX_SNAP && rect.height <= MAX_SNAP) {
          const arrived = snap !== snapElRef.current;
          snapElRef.current = snap;
          setMode("snap");
          lockTo(snap, arrived);
          return;
        }
      }

      snapElRef.current = null;
      const blob = Boolean(target.closest(BLOB_SELECTOR));
      setMode(blob ? "blob" : "idle");

      const size = blob ? RING_BLOB : RING_IDLE;
      rx.set(pointerRef.current.x);
      ry.set(pointerRef.current.y);
      w.set(size);
      h.set(size);
      r.set(999);
    };

    const handleMove = (e: PointerEvent) => {
      // A pointermove dispatched straight at window (rather than at an
      // element) would put a non-Element in e.target and throw on the
      // closest() walk below, killing the listener for the rest of the page's
      // life. The Spline scene forwards cursor position by re-dispatching
      // pointermove, so this path is reachable, not theoretical.
      if (!(e.target instanceof Element)) return;

      // The position write is a plain value set — no layout read, no React
      // render — so it happens on the event itself. Deferring it to the next
      // frame, as this used to, is exactly the delay a cursor is felt as: up
      // to a full frame of lag behind the pointer on every single move.
      pointerRef.current = { x: e.clientX, y: e.clientY };
      px.set(e.clientX);
      py.set(e.clientY);

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      // The hit-test behind it does read layout, so that half stays coalesced
      // to one run per painted frame even at 1000Hz pointer rates. Holding the
      // frame open and re-reading the newest target beats cancel-and-reschedule:
      // it resolves one frame after the first move of a burst rather than one
      // frame after the last, and still uses the position the burst ended at.
      targetRef.current = e.target as HTMLElement;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const target = targetRef.current;
        if (target) resolve(target);
      });
    };

    // A snapped ring is pinned to page coordinates, so scrolling under a
    // still pointer would leave it behind without this. Coalesced into a
    // frame because scroll fires far denser than it paints, and each call
    // costs a getBoundingClientRect + getComputedStyle.
    let scrollFrame: number | null = null;
    const handleScroll = () => {
      if (!snapElRef.current || scrollFrame !== null) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = null;
        const el = snapElRef.current;
        // Scrolling moves the box, never its corner radius.
        if (el) lockTo(el, false);
      });
    };

    const handleLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.removeEventListener("mouseleave", handleLeave);
      // Cleared, not just cancelled: a pending id left behind would make the
      // handler above believe a frame is still queued after a re-mount, and
      // no hit-test would ever be scheduled again.
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      targetRef.current = null;
      if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
    };
  }, [enabled, lockTo, px, py, rx, ry, w, h, r]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="border border-violet/70 shadow-[0_0_22px_rgba(124,92,252,0.35)]"
          style={{
            width: ringW,
            height: ringH,
            borderRadius: ringR,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            opacity: mode === "snap" ? 0.9 : 0.55,
            scale: pressed ? 0.92 : 1,
          }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference will-change-transform"
        style={{ x: dotX, y: dotY, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="rounded-full bg-ink"
          animate={{
            // The dot shrinks away inside a snapped frame — the frame is
            // already showing precisely what is about to be clicked.
            width: mode === "snap" ? 4 : pressed ? 12 : 7,
            height: mode === "snap" ? 4 : pressed ? 12 : 7,
            opacity: mode === "blob" ? 0.7 : 1,
          }}
          style={{ translateX: "-50%", translateY: "-50%" }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </>
  );
}

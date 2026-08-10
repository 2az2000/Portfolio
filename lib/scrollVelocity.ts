/**
 * The page's current scroll velocity, published by Lenis (see
 * components/SmoothScroll.tsx) and read by anything that should react to how
 * fast the visitor is moving rather than just to where they are.
 *
 * A module singleton with a plain getter, matching lib/smoothScroll.ts, and
 * deliberately *not* React state: the consumers read this inside their own
 * per-frame loops, and routing a value that changes every frame through
 * setState would re-render a component 60 times a second to move something by
 * a few pixels.
 *
 * It is also deliberately not a CSS custom property on <html>. Custom
 * properties inherit, so rewriting one on the root every scroll event
 * invalidates style for every element that could read it — on a page this
 * dense that is a real cost for an effect that is supposed to be free.
 */

/** Roughly the Lenis velocity of a brisk wheel scroll; used to map raw
 *  velocity onto a -1..1 range so consumers can reason in fractions rather
 *  than in whatever units the scroller happens to report. */
const REFERENCE_VELOCITY = 40;

/**
 * Lenis stops emitting once the scroll settles, so a stored value would sit
 * at whatever it was when the last event fired and never come back down. Any
 * reading older than this is treated as "not scrolling".
 */
const STALE_MS = 120;

let velocity = 0;
let updatedAt = 0;

export function publishScrollVelocity(raw: number) {
  velocity = Math.max(-1, Math.min(1, raw / REFERENCE_VELOCITY));
  updatedAt = performance.now();
}

/** Normalized to -1..1. Positive means scrolling down. Returns 0 when the
 *  page is still, when Lenis isn't running (reduced motion), or on the
 *  server. */
export function getScrollVelocity(): number {
  if (typeof performance === "undefined") return 0;
  if (performance.now() - updatedAt > STALE_MS) velocity = 0;
  return velocity;
}

export function resetScrollVelocity() {
  velocity = 0;
  updatedAt = 0;
}

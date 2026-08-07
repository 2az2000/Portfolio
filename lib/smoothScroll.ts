import type Lenis from "lenis";
import { prefersReducedMotion } from "./theme";

/**
 * One shared handle on the page's smooth scroller (see
 * components/SmoothScroll.tsx). Anything that wants to move the page — the
 * navbar links, the logo, the hero CTAs — has to go through the helpers
 * below rather than calling `scrollIntoView`/`window.scrollTo` directly:
 * once Lenis owns the scroll position, a native smooth scroll runs a second
 * animation against the same scrollTop and the two fight each other, which
 * reads as a stutter or an overshoot that snaps back.
 *
 * Kept as a module singleton instead of a context so plain callbacks (and
 * non-React code) can use it without threading a provider through every
 * component that happens to have a link in it.
 */
let scroller: Lenis | null = null;

/** The fixed navbar's height — a section scrolled flush to the viewport top
 *  would sit underneath it, so every target lands this far below instead. */
const NAV_OFFSET = 80;

export function setSmoothScroller(next: Lenis | null) {
  scroller = next;
}

/** Scrolls a section id into view, under the navbar. Falls back to a native
 *  scroll when Lenis isn't running (reduced motion, or before mount). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  if (scroller) {
    scroller.scrollTo(el, { offset: -NAV_OFFSET });
    return;
  }

  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
    // An explicit `behavior` wins over the CSS `scroll-behavior`, so the
    // reduced-motion case has to opt out here rather than relying on the
    // global override in globals.css.
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

export function scrollToTop() {
  if (scroller) {
    scroller.scrollTo(0);
    return;
  }
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

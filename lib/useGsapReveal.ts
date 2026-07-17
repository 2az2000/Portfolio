"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { DURATION, EASE_BRAND_CSS, STAGGER_BASE, prefersReducedMotion } from "./theme";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealOptions = {
  /** CSS selector (relative to the container) for the items to stagger in. */
  selector: string;
  /** Distance in px the items travel while fading in. */
  y?: number;
  /** Overrides the shared stagger rhythm if a section needs a different pace. */
  stagger?: number;
};

/**
 * Attaches one consistent "fade + rise, staggered" entrance to a group of
 * elements when the container scrolls into view. Every section should use
 * this instead of writing its own GSAP timeline, so entrance motion stays
 * identical site-wide (see AGENTS.md §5, modularity rule 4).
 */
export function useGsapReveal<T extends HTMLElement>(
  { selector, y = 32, stagger = STAGGER_BASE }: RevealOptions
): RefObject<T> {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (prefersReducedMotion()) {
      gsap.set(container.querySelectorAll(selector), { opacity: 1, y: 0 });
      return;
    }

    const targets = container.querySelectorAll(selector);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.slow,
          ease: EASE_BRAND_CSS,
          stagger,
          scrollTrigger: {
            trigger: container,
            start: "top 78%",
            once: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}

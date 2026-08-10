"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { DURATION, prefersReducedMotion } from "@/lib/theme";
import { setSmoothScroller } from "@/lib/smoothScroll";
import { publishScrollVelocity, resetScrollVelocity } from "@/lib/scrollVelocity";

/**
 * Site-wide inertial scrolling (Lenis). Renders nothing — it only takes over
 * the wheel/keyboard scroll and eases the page toward the target position
 * instead of jumping by the OS's raw wheel delta, which is what makes a
 * mouse wheel feel like a series of steps rather than a movement.
 *
 * Three things make this safe rather than the usual "scrolljacking":
 *
 * 1. It drives Lenis from GSAP's ticker instead of its own rAF loop, so the
 *    whole site still runs on ONE animation frame callback, and every
 *    ScrollTrigger in the project (useGsapReveal, Experience's progress
 *    beam) is updated from Lenis' position — otherwise scroll-driven
 *    animations read the browser's scrollTop a frame late and visibly lag
 *    behind the content they're pinned to.
 * 2. Touch is left completely alone (`syncTouch: false`). Native momentum
 *    scrolling on a phone is already excellent and re-implementing it in JS
 *    is exactly where smooth-scroll libraries earn their bad reputation.
 * 3. `prefers-reduced-motion` skips it entirely: the page keeps the
 *    browser's own instant scrolling, which is the point of that setting.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      // Same duration/curve family as every other transition on the site:
      // an expo-out that covers most of the distance immediately and then
      // settles, rather than a symmetric ease that feels floaty.
      duration: DURATION.slow,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    setSmoothScroller(lenis);

    // One scroll callback feeding both consumers of the scroll position:
    // ScrollTrigger, which needs to know where the page is, and the velocity
    // store, which needs to know how fast it is getting there (see
    // lib/scrollVelocity.ts — the marquee reads it every frame).
    lenis.on("scroll", () => {
      ScrollTrigger.update();
      publishScrollVelocity(lenis.velocity);
    });

    const tick = (time: number) => lenis.raf(time * 1000); // gsap ticker is in seconds
    gsap.ticker.add(tick);
    // GSAP's lag smoothing pauses the ticker after a long frame, which would
    // freeze Lenis mid-scroll and leave the page stuck until the next event.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // GSAP's own defaults
      lenis.destroy();
      setSmoothScroller(null);
      resetScrollVelocity();
    };
  }, []);

  return null;
}

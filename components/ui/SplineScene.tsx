"use client";

import { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";
import { cn } from "@/lib/utils";

// Spline needs WebGL + browser APIs, so it's lazy-loaded on the client only.
// This keeps it out of the server bundle and out of the initial JS payload
// for people who never scroll to (or never can render) the hero.
const Spline = lazy(() => import("@splinetool/react-spline"));

type SplineSceneProps = {
  scene: string;
  className?: string;
};

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [hasError, setHasError] = useState(false);
  // One-way latch, not a live toggle: it flips to true the first time the
  // scene nears the viewport and then stays true forever. Earlier this was
  // a live IntersectionObserver toggle that unmounted the <Spline> (and its
  // WebGL context) every time it scrolled far out of view and remounted it
  // on the way back — which re-ran the scene's intro animation from
  // scratch on every scroll-down-then-up. The scene must render once.
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "50% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasLoaded]);

  // The scene renders once and is never unmounted (see the latch above),
  // but a live WebGL render loop left running forever — including while
  // scrolled deep into Contact, far from the hero — was still burning a
  // frame budget for the entire session. `stop()`/`play()` pause and
  // resume the Application's render loop in place (unlike unmounting, this
  // keeps its scene state intact, so resuming never replays the intro).
  useEffect(() => {
    if (!hasLoaded) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const app = appRef.current;
        if (!app) return;
        if (entry.isIntersecting) app.play();
        else app.stop();
      },
      { rootMargin: "50% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasLoaded]);

  // Spline's own "look at cursor" interaction (authored inside the scene)
  // only ever listens on its own <canvas>, so hovering over page content
  // stacked on top of the full-bleed background would normally never reach
  // it. Forward real cursor position from the whole window onto that
  // canvas ourselves so the scene keeps tracking the mouse no matter what
  // page element is actually under the cursor.
  useEffect(() => {
    if (!hasLoaded) return;
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const canvas = container.querySelector("canvas");
      if (!canvas) return;
      canvas.dispatchEvent(
        new PointerEvent("pointermove", {
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: true,
          cancelable: true,
          pointerId: e.pointerId,
          pointerType: e.pointerType,
        })
      );
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [hasLoaded]);

  if (hasError) {
    // If the scene fails (blocked network, WebGL unavailable, ad-blocker,
    // etc.) fall back to a quiet gradient instead of a broken box — the
    // hero's text content still stands on its own without this.
    return (
      <div
        ref={containerRef}
        className={cn("flex items-center justify-center bg-grid-glow", className)}
      >
        <div className="h-24 w-24 animate-float rounded-full bg-aurora opacity-30 blur-2xl" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      {hasLoaded ? (
        <Suspense
          fallback={
            <div className={cn("flex items-center justify-center", className)}>
              <div className="flex items-center gap-3 font-mono text-sm text-mist">
                <span className="h-2 w-2 animate-pulse rounded-full bg-violet" />
                loading scene...
              </div>
            </div>
          }
        >
          <Spline
            scene={scene}
            className={className}
            onLoad={(app) => {
              appRef.current = app;
            }}
            onError={() => setHasError(true)}
          />
        </Suspense>
      ) : (
        // Not near the viewport yet on first load: keep the same footprint
        // (no layout shift once it mounts) without paying for WebGL before
        // it's needed. Once `hasLoaded` flips true above, this branch is
        // never shown again for the lifetime of this component.
        <div className={cn("h-full w-full", className)} />
      )}
    </div>
  );
}

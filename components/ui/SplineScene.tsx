"use client";

import { Suspense, lazy, useState } from "react";
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

  if (hasError) {
    // If the scene fails (blocked network, WebGL unavailable, ad-blocker,
    // etc.) fall back to a quiet gradient instead of a broken box — the
    // hero's text content still stands on its own without this.
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-line bg-grid-glow",
          className
        )}
      >
        <div className="h-24 w-24 animate-float rounded-full bg-aurora opacity-30 blur-2xl" />
      </div>
    );
  }

  return (
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
        onError={() => setHasError(true)}
      />
    </Suspense>
  );
}

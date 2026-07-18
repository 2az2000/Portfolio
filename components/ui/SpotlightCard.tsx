"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** Small mono-font tag rendered like a filename, e.g. "spotlight-card.tsx" */
  fileLabel?: string;
  /** Spotlight tint — defaults to the brand violet. */
  color?: string;
};

/**
 * A glass card with a radial highlight that follows the cursor, driven by
 * two CSS custom properties updated on pointer move (no React re-render on
 * every mouse pixel — this keeps it smooth even on a 1x1 grid of cards).
 */
export function SpotlightCard({
  children,
  className,
  fileLabel,
  color = "124,92,252", // violet in "r,g,b" form for the rgba() mask
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      data-cursor="magnetic"
      className={cn(
        "group relative overflow-hidden rounded-lg border border-line bg-white/[0.04] p-6 backdrop-blur-md transition-colors duration-fast ease-brand hover:border-violet/30 dark:hover:border-white/20",
        className
      )}
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "50%",
        } as React.CSSProperties
      }
    >
      {/* Spotlight layer: only visible on hover, tracks pointer via CSS vars */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-fast ease-brand group-hover:opacity-100"
        style={{
          background: `radial-gradient(320px circle at var(--spot-x) var(--spot-y), rgba(${color}, 0.15), transparent 70%)`,
        }}
      />

      {fileLabel && (
        <span className="caption relative z-10 mb-4 block">
          {fileLabel}
        </span>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}

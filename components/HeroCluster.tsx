"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTheme } from "next-themes";
import { DURATION, EASE_BRAND_CSS, prefersReducedMotion } from "@/lib/theme";

/**
 * The hero's "Proof, not Promise" cluster (AGENTS.md §3.1): a handful of
 * real, working mini components that fly in and snap into an irregular
 * bento arrangement on load, instead of a static illustration.
 */
export function HeroCluster() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pieces = container.querySelectorAll<HTMLElement>("[data-piece]");
    if (!pieces.length) return;

    if (prefersReducedMotion()) {
      gsap.set(pieces, { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        pieces,
        {
          opacity: 0,
          scale: 0.6,
          x: (i) => (i % 2 === 0 ? -60 : 60),
          y: (i) => (i % 3 === 0 ? -40 : 40),
          rotate: (i) => (i % 2 === 0 ? -18 : 18),
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          rotate: 0,
          duration: DURATION.slow,
          ease: EASE_BRAND_CSS,
          stagger: 0.12,
          delay: 0.2,
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto h-[360px] w-full max-w-md md:h-[420px]">
      <div data-piece className="absolute left-[6%] top-[8%]">
        <BadgeProof />
      </div>
      <div data-piece className="absolute right-[4%] top-[4%]">
        <ProgressRingProof />
      </div>
      <div data-piece className="absolute left-[2%] top-[46%]">
        <ToggleProof />
      </div>
      <div data-piece className="absolute right-[8%] top-[42%] w-[55%]">
        <SliderProof />
      </div>
      {/* <div data-piece className="absolute bottom-[6%] left-[16%]">
        <BadgeProof label="TypeScript" tone="amber" />
      </div> */}
    </div>
  );
}

function BadgeProof({
  label = "Available for work",
  tone = "mint",
}: {
  label?: string;
  tone?: "mint" | "amber";
}) {
  const toneClasses =
    tone === "mint"
      ? "border-mint/40 bg-mint/10 text-mint-soft"
      : "border-amber/40 bg-amber/10 text-amber";
  return (
    <span
      className={`glass inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-mono ${toneClasses}`}
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      {label}
    </span>
  );
}

function ToggleProof() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Before mount, `theme` hasn't resolved from storage yet — fall back to
  // the site's deterministic default (dark) so SSR and the first client
  // render agree instead of triggering a hydration mismatch (which was
  // forcing React to throw away and re-render the whole tree).
  const isDark = mounted ? theme === "dark" : true;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="focus-ring glass flex items-center gap-3 rounded-pill px-4 py-2.5"
    >
      <span
        className={`relative h-5 w-9 rounded-pill transition-colors duration-fast ease-brand ${
          isDark ? "bg-violet" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-ink transition-transform duration-fast ease-brand ${
            isDark ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="font-mono text-sm text-ink">
        {isDark ? "dark mode" : "light mode"}
      </span>
    </button>
  );
}

function SliderProof() {
  const [value, setValue] = useState(72);
  return (
    <div className="glass w-full rounded-lg px-4 py-3">
      <div className="mb-2 flex items-center justify-between font-mono text-xs text-mist">
        <span>performance</span>
        <span className="text-mint">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-pill bg-white/10 accent-violet"
      />
    </div>
  );
}

function ProgressRingProof() {
  const value = 86;
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="glass flex items-center gap-3 rounded-lg px-4 py-3">
      <svg width="60" height="60" viewBox="0 0 60 60" className="-rotate-90">
        <circle cx="30" cy="30" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="5" fill="none" />
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="#7C5CFC"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="font-mono text-xs text-mist">
        <div className="text-base text-ink">{value}</div>
        Lighthouse
      </div>
    </div>
  );
}

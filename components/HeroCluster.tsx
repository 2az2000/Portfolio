"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
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
      <div data-piece className="absolute left-[4%] top-[4%] w-[72%]">
        <CodeTypingProof />
      </div>
      <div data-piece className="absolute right-[2%] top-[8%]">
        <BadgeProof />
      </div>
      <div data-piece className="absolute bottom-[10%] left-[8%] w-[82%]">
        <CommitLogProof />
      </div>
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

const SNIPPET = "const proof = () => {\n  return skill;\n};";

function CodeTypingProof() {
  const [typed, setTyped] = useState(SNIPPET);
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let i = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!deleting) {
        i++;
        setTyped(SNIPPET.slice(0, i));
        if (i >= SNIPPET.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 2200);
          return;
        }
        timeoutId = setTimeout(tick, 45);
      } else {
        i--;
        setTyped(SNIPPET.slice(0, i));
        if (i <= 0) {
          deleting = false;
          timeoutId = setTimeout(tick, 600);
          return;
        }
        timeoutId = setTimeout(tick, 20);
      }
    };

    timeoutId = setTimeout(tick, 800);
    return () => clearTimeout(timeoutId);
  }, []);

  // Caret blinks independently of the typing cadence, like a real editor.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setShowCaret((v) => !v), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass w-full overflow-hidden rounded-lg">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-mist/40" />
        <span className="h-2 w-2 rounded-full bg-mist/40" />
        <span className="h-2 w-2 rounded-full bg-mist/40" />
        <span className="ml-2 font-mono text-xs text-mist">hero.tsx</span>
      </div>
      <pre className="min-h-[84px] whitespace-pre-wrap px-4 py-3 font-mono text-xs leading-relaxed text-ink">
        {typed}
        <span className={showCaret ? "text-violet" : "text-transparent"}>▌</span>
      </pre>
    </div>
  );
}

function CommitLogProof() {
  return (
    <div className="glass flex items-center gap-3 overflow-hidden rounded-lg px-4 py-3 font-mono text-xs text-mist">
      <span className="shrink-0 rounded-pill border border-mint/40 bg-mint/10 px-2 py-1 text-mint-soft">
        a3f9c2d
      </span>
      <span className="truncate text-ink">feat: ship proof cluster</span>
    </div>
  );
}

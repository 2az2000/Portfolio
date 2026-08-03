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
    // Below md this is a plain stacked flow (the absolute bento layout below
    // was authored for a wide box — on a phone-width column it had nowhere
    // to put the badge but on top of the code card, plus a fixed 360px
    // height that left a dead gap once everything was forced to overlap
    // near the top instead of filling it).
    <div
      ref={containerRef}
      className="relative mx-auto flex w-full max-w-md flex-col items-start gap-3 md:block md:h-[420px]"
    >
      <div data-piece className="relative w-full md:absolute md:start-[4%] md:top-[4%] md:w-[72%]">
        <CodeTypingProof />
        {/* On mobile the badge rides the corner of the code card as a
            tilted ribbon instead of sitting in its own full-width row —
            stacked in normal flow, a second "living dot" pill right under
            the hero's status pill above just repeated the same idea. The
            desktop bento below has room to give it its own spot instead. */}
        <div className="absolute -top-3 end-4 rotate-2 md:hidden">
          <BadgeProof />
        </div>
      </div>
      <div data-piece className="hidden md:absolute md:end-[2%] md:top-[8%] md:block">
        <BadgeProof />
      </div>
      <div data-piece className="w-full md:absolute md:bottom-[10%] md:start-[8%] md:w-[82%]">
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
  const containerRef = useRef<HTMLDivElement>(null);
  // The type/delete loop and caret blink below used to run unconditionally
  // for the entire session — including deep into Contact, far past the
  // hero — burning a setTimeout/setInterval tick every 20-45ms forever.
  // Gate both on visibility the same way SplineScene gates its WebGL
  // render loop: pause off-screen, resume (restarting the loop, which
  // reads fine for a decorative typing animation) back in view.
  const [isVisible, setIsVisible] = useState(false);
  const [typed, setTyped] = useState(SNIPPET);
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !isVisible) return;

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
  }, [isVisible]);

  // Caret blinks independently of the typing cadence, like a real editor.
  useEffect(() => {
    if (prefersReducedMotion() || !isVisible) return;
    const id = setInterval(() => setShowCaret((v) => !v), 500);
    return () => clearInterval(id);
  }, [isVisible]);

  return (
    <div ref={containerRef} className="glass w-full overflow-hidden rounded-lg">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-mist/40" />
        <span className="h-2 w-2 rounded-full bg-mist/40" />
        <span className="h-2 w-2 rounded-full bg-mist/40" />
        <span className="ms-2 font-mono text-xs text-mist">hero.tsx</span>
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

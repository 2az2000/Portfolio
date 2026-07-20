"use client";

import { useEffect, useRef } from "react";
import { Building2, GitCommitHorizontal } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { useGsapReveal } from "@/lib/useGsapReveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { EASE_BRAND_CSS, prefersReducedMotion } from "@/lib/theme";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ExperienceItem = {
  hash: string;
  message: string;
  date: string;
  company: string;
  role: string;
};

// Alternating violet/mint per card — the timeline node and the card's
// cursor-spotlight both pick up this same color, so a commit "ignites" in
// one consistent tint as it becomes the active one.
const NODE_COLORS = ["124,92,252", "51,230,184"];

function ExperienceCard({ item, index }: { item: ExperienceItem; index: number }) {
  const cardRef = useRef<HTMLLIElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 22, mass: 0.5 });
  const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 22, mass: 0.5 });
  const color = NODE_COLORS[index % NODE_COLORS.length];

  // Mouse-tracked tilt, mouse only — a touch drag scrolling past the card
  // would otherwise fight this for the same pointermove events.
  function handlePointerMove(e: React.PointerEvent<HTMLLIElement>) {
    if (e.pointerType !== "mouse") return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 5);
    rotateX.set(py * -5);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.li
      ref={cardRef}
      data-exp-card
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 900,
      }}
      className="relative md:ms-14"
    >
      <span
        data-exp-node
        aria-hidden
        className="absolute -start-14 top-5 hidden h-8 w-8 items-center justify-center rounded-full border border-line bg-surface font-mono text-xs text-mint md:flex"
        style={{ "--exp-node-color": color } as React.CSSProperties}
      >
        <Building2 size={14} />
      </span>

      <SpotlightCard color={color} className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3 border-b border-line pb-3">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-violet/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-mint/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
          </div>
          <span className="caption flex items-center gap-1.5 text-violet-soft">
            <GitCommitHorizontal size={12} />
            git show {item.hash}
          </span>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-display text-base text-ink">{item.company}</span>
              <span className="caption text-violet-soft">{item.role}</span>
            </div>
            <p className="text-sm text-mist">{item.message}</p>
          </div>
          <span className="caption shrink-0 text-mist md:text-end">{item.date}</span>
        </div>
      </SpotlightCard>
    </motion.li>
  );
}

export function Experience() {
  const { t } = useLanguage();
  const headingRef = useGsapReveal<HTMLDivElement>({ selector: "[data-reveal]" });
  const listRef = useRef<HTMLUListElement>(null);

  // Alternating left/right slide-in per card, tied to scroll position
  // (scrub) instead of a one-shot stagger — a second, distinct GSAP
  // technique alongside the fade/rise used everywhere else (AGENTS.md
  // motion tokens still drive the easing so it stays on-brand). Each card
  // also gets its own ScrollTrigger toggling its timeline node "active" as
  // it crosses the middle of the viewport, in lockstep with the glowing
  // beam traveling down the connecting line below.
  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion()) return;

    const cards = list.querySelectorAll<HTMLElement>("[data-exp-card]");
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: i % 2 === 0 ? -48 : 48 },
          {
            opacity: 1,
            x: 0,
            ease: EASE_BRAND_CSS,
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              end: "top 60%",
              scrub: 0.6,
            },
          }
        );

        const node = card.querySelector<HTMLElement>("[data-exp-node]");
        if (node) {
          ScrollTrigger.create({
            trigger: card,
            start: "top 65%",
            end: "bottom 45%",
            toggleClass: { targets: node, className: "is-active" },
          });
        }
      });

      // The connecting line grows as the list scrolls into view, and a
      // glowing "playhead" travels down it in lockstep — same scrub, one
      // shared onUpdate driving a CSS var instead of a second ScrollTrigger.
      gsap.fromTo(
        "[data-exp-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: list,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.6,
            onUpdate: (self) => {
              list.style.setProperty("--exp-progress", self.progress.toFixed(4));
            },
          },
        }
      );
    }, list);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="section-py container" ref={headingRef}>
      <div data-reveal className="mb-12 max-w-2xl">
        <p className="caption mb-3">{t.nav.experience}</p>
        <h2 className="text-h2 font-display text-ink">{t.experience.heading}</h2>
        <p className="mt-3 text-body text-mist">{t.experience.subheading}</p>
      </div>

      <ul
        ref={listRef}
        className="relative space-y-5"
        style={{ "--exp-progress": 0 } as React.CSSProperties}
      >
        <span
          data-exp-line
          aria-hidden
          className="absolute bottom-2 left-6 top-2 hidden w-px origin-top bg-gradient-to-b from-violet via-mint to-mint/30 md:block"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-6 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint shadow-[0_0_14px_4px_rgba(51,230,184,0.65)] md:block"
          style={{ top: "calc(0.5rem + var(--exp-progress, 0) * (100% - 1rem))" }}
        />

        {t.experience.items.map((item, i) => (
          <ExperienceCard key={item.hash} item={item} index={i} />
        ))}
      </ul>
    </section>
  );
}

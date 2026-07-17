"use client";

import { useEffect, useRef } from "react";
import { GitCommitHorizontal, Building2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useLanguage } from "@/components/LanguageProvider";
import { useGsapReveal } from "@/lib/useGsapReveal";
import { EASE_BRAND_CSS, prefersReducedMotion } from "@/lib/theme";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Experience() {
  const { t } = useLanguage();
  const headingRef = useGsapReveal<HTMLDivElement>({ selector: "[data-reveal]" });
  const listRef = useRef<HTMLUListElement>(null);

  // Alternating left/right slide-in per card, tied to scroll position
  // (scrub) instead of a one-shot stagger — a second, distinct GSAP
  // technique alongside the fade/rise used everywhere else (AGENTS.md
  // motion tokens still drive the easing so it stays on-brand).
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
      });

      // the connecting line grows as the list scrolls into view
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

      <ul ref={listRef} className="relative space-y-5">
        <span
          data-exp-line
          aria-hidden
          className="absolute bottom-2 left-6 top-2 hidden w-px origin-top bg-line md:block"
        />

        {t.experience.items.map((item) => (
          <li
            key={item.hash}
            data-exp-card
            className="glass group relative flex flex-col gap-4 rounded-lg p-5 transition-colors duration-fast ease-brand hover:border-white/20 md:ms-14 md:flex-row md:items-center"
          >
            {/* company monogram, doubles as the timeline "node" on desktop */}
            <span className="absolute -start-14 top-5 hidden h-8 w-8 items-center justify-center rounded-full border border-line bg-surface font-mono text-xs text-mint md:flex">
              <Building2 size={14} />
            </span>

            <div className="flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-display text-base text-ink">{item.company}</span>
                <span className="caption text-violet-soft">{item.role}</span>
              </div>
              <p className="text-sm text-mist">{item.message}</p>
            </div>

            <div className="flex shrink-0 items-center gap-3 font-mono text-xs text-mist md:flex-col md:items-end md:gap-1">
              <span className="flex items-center gap-1.5 text-violet-soft">
                <GitCommitHorizontal size={13} />
                {item.hash}
              </span>
              <span className="caption">{item.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

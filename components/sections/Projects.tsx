"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useLanguage } from "@/components/LanguageProvider";
import { useGsapReveal } from "@/lib/useGsapReveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { EASE_BRAND_CSS, prefersReducedMotion } from "@/lib/theme";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Stand-in mark for projects that have no logo of their own — the same AZ
 * mark the site uses in the navbar and as its favicon. It keeps every card
 * in the grid on one shape instead of letting half of them start with a
 * title and half with an icon, and it reads as "mine" rather than as an
 * empty placeholder box.
 */
const FALLBACK_LOGO = "/images/az-logo-96.webp";

export function Projects() {
  const { t } = useLanguage();
  const headingRef = useGsapReveal<HTMLDivElement>({ selector: "[data-reveal]" });
  const gridRef = useRef<HTMLDivElement>(null);

  // A third distinct GSAP technique (see Skills' fade/rise and Experience's
  // scrubbed slide): ScrollTrigger.batch pops each card in with a spring-y
  // scale as it crosses the viewport, batched so simultaneous entrances
  // stagger together instead of firing one-by-one.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) return;

    const cards = grid.querySelectorAll<HTMLElement>("[data-project-card]");
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, scale: 0.92, y: 24 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.7,
              ease: EASE_BRAND_CSS,
              stagger: 0.12,
            }
          ),
      });
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="section-py container">
      <div ref={headingRef} data-reveal className="mb-12 max-w-2xl">
        {/* <p className="caption mb-3">{t.nav.projects}</p> */}
        <h2 className="text-h2 font-display text-ink">{t.projects.heading}</h2>
        <p className="mt-3 text-body text-mist">{t.projects.subheading}</p>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {t.projects.items.map((project) => {
          // Not everything shipped has a public URL (internal products, work
          // still under NDA). Those render as a plain card rather than a link
          // that goes nowhere — and drop the "opens elsewhere" arrow with it.
          const linked = project.href !== "#";
          const Card = linked ? "a" : "div";

          return (
            <Card
              key={project.title}
              {...(linked ? { href: project.href, target: "_blank", rel: "noreferrer" } : {})}
              data-project-card
              className={
                project.featured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : "lg:col-span-2"
              }
            >
              <SpotlightCard className="group h-full min-h-[220px]">
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* A plain <img>: these are 96px product marks a few KB
                        each, so routing them through the image optimizer
                        would cost a round trip to save nothing. */}
                      {/* eslint-disable-next-line @next/next/no-img-element -- deliberate, see above */}
                      <img
                        src={project.logo ?? FALLBACK_LOGO}
                        alt=""
                        width={36}
                        height={36}
                        loading="lazy"
                        decoding="async"
                        className={cn(
                          "h-9 w-9 shrink-0 rounded-md border border-line object-contain",
                          // Product marks are flat and often dark, so they need a
                          // light tile; the AZ mark is transparent with dark navy
                          // strokes, and only separates from the card on a dark one.
                          project.logo ? "bg-white/90" : "bg-white/80"
                        )}
                      />
                      <h3
                        className={
                          project.featured
                            ? "font-display text-xl text-ink"
                            : "font-display text-lg text-ink"
                        }
                      >
                        {project.title}
                      </h3>
                    </div>
                    <div className="flex shrink-0 items-center gap-2.5">
                      {/* Says whether this shipped to real users or is something
                        I built in the open — the one thing a visitor can't
                        infer from the title and the stack chips. */}
                      <span className="caption whitespace-nowrap">{project.context}</span>
                      {linked && (
                        <ArrowUpRight
                          size={18}
                          className="text-mist transition-transform duration-fast ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-mint rtl:group-hover:-translate-x-0.5"
                        />
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-mist">{project.description}</p>

                  {/* Only the featured card has the vertical room for these. */}
                  {project.highlights && (
                    <ul className="mt-5 space-y-2.5">
                      {project.highlights.map((point) => (
                        <li key={point} className="flex gap-2.5 text-sm text-mist">
                          <span
                            aria-hidden
                            className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-mint"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="caption rounded-pill border border-line px-2.5 py-1"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

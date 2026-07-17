"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useLanguage } from "@/components/LanguageProvider";
import { useGsapReveal } from "@/lib/useGsapReveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { EASE_BRAND_CSS, prefersReducedMotion } from "@/lib/theme";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
        <p className="caption mb-3">{t.nav.projects}</p>
        <h2 className="text-h2 font-display text-ink">{t.projects.heading}</h2>
        <p className="mt-3 text-body text-mist">{t.projects.subheading}</p>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {t.projects.items.map((project) => (
          <a
            key={project.title}
            href={project.href}
            target={project.href === "#" ? undefined : "_blank"}
            rel={project.href === "#" ? undefined : "noreferrer"}
            data-project-card
            className={
              project.featured
                ? "sm:col-span-2 lg:col-span-2 lg:row-span-2"
                : "lg:col-span-2"
            }
          >
            <SpotlightCard className="group h-full min-h-[220px]">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg text-ink">{project.title}</h3>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-mist transition-transform duration-fast ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-mint"
                  />
                </div>

                <p className="mt-3 text-sm text-mist">{project.description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
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
          </a>
        ))}
      </div>
    </section>
  );
}

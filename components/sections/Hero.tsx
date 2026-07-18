"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useGsapReveal } from "@/lib/useGsapReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SplineScene } from "@/components/ui/SplineScene";
import { HeroCluster } from "@/components/HeroCluster";

const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export function Hero() {
  const { t, dir } = useLanguage();
  const containerRef = useGsapReveal<HTMLDivElement>({
    selector: "[data-reveal]",
    y: 40,
  });

  const ArrowIcon = dir === "rtl" ? ArrowDownRight : ArrowUpRight;

  return (
    <section
      id="hero"
      ref={containerRef}
      className="section-py relative isolate mt-16 min-h-[85vh] overflow-hidden md:mt-24 md:min-h-[90vh]"
    >
      {/* ---- Spline scene: full-bleed hero background, tracks the cursor
             anywhere on screen (see SplineScene.tsx), not just its own box.
             The scene itself always centers its subject in its own canvas,
             so the canvas is rendered oversized and anchored to the
             logical "start" edge — pushing the subject toward the "end"
             side (opposite the text column) instead of dead-center.
             start/end (not left/right) so this flips automatically with
             the page's dir, same as the old grid's `order` trick did. ---- */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-y-0 start-0 w-[150%] md:w-[130%]">
          <SplineScene scene={SPLINE_SCENE_URL} className="h-full w-full" />
        </div>
      </div>

      <div className="container">
        <div className="max-w-xl">
          <p data-reveal className="mb-5 font-mono text-sm text-mint">
            {t.hero.eyebrow}
          </p>

          <h1 data-reveal className="text-hero font-display text-ink">
            {t.hero.title}
          </h1>

          <p data-reveal className="mt-6 max-w-md text-body text-mist">
            {t.hero.subtitle}
          </p>

          <div data-reveal className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton
              onClick={() =>
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t.hero.ctaPrimary}
              <ArrowIcon size={16} />
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t.hero.ctaSecondary}
            </MagneticButton>
          </div>
        </div>

        {/* ---- proof-piece cluster: real, clickable mini components (AGENTS.md §3.1) ---- */}
        <div data-reveal className="mt-16">
          <HeroCluster />
        </div>
      </div>
    </section>
  );
}

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
      className="section-py container mt-16 md:mt-24"
    >
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        {/* ---- text column ---- */}
        <div className="order-2 md:order-1">
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

        {/* ---- visual column: Spline scene with the proof-cluster badges anchored on top ---- */}
        <div data-reveal className="order-1 md:order-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-line bg-surface">
            <SplineScene scene={SPLINE_SCENE_URL} className="h-full w-full" />
          </div>
        </div>
      </div>

      {/* ---- proof-piece cluster: real, clickable mini components (AGENTS.md §3.1) ---- */}
      <div data-reveal className="mt-4">
        <HeroCluster />
      </div>
    </section>
  );
}

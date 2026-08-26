"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useGsapReveal } from "@/lib/useGsapReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SplineScene } from "@/components/ui/SplineScene";
// Commented out alongside the fact rail below, which is currently disabled.
// Restore both together.
// import { HeroCluster } from "@/components/HeroCluster";
import { scrollToId } from "@/lib/smoothScroll";

const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

// Matches the earliest entry in experience.items ("Started professional
// frontend engineering journey", 2023) — the hero's "years of experience"
// stat is computed from this instead of being hand-typed, so it can't
// silently drift out of sync as another year passes.
const CAREER_START_YEAR = 2023;

export function Hero() {
  const { t, dir } = useLanguage();
  const containerRef = useGsapReveal<HTMLDivElement>({
    selector: "[data-reveal]",
    y: 40,
  });

  const ArrowIcon = dir === "rtl" ? ArrowDownRight : ArrowUpRight;

  // The display name's last word (surname) gets the aurora-gradient accent
  // — splitting on a space keeps this locale-agnostic (works the same for
  // "Amirali Zand" and "امیرعلی زند") without adding a new dictionary key
  // just to mark up part of an existing string.
  const titleWords = t.hero.title.trim().split(" ");
  const titleAccent = titleWords[titleWords.length - 1];
  const titleLead = titleWords.slice(0, -1).join(" ");

  const yearsExperience = Math.max(1, new Date().getFullYear() - CAREER_START_YEAR);

  return (
    <section id="hero" ref={containerRef} className="section-py container mt-16 md:mt-24">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        {/* ---- text column ---- */}
        <div className="order-2 md:order-1">
          {/* Status pill: same "living dot" language as HeroCluster's
              BadgeProof, just applied to the existing eyebrow line instead
              of introducing new copy. */}
          <div
            data-reveal
            className="glass mb-6 inline-flex items-center gap-2.5 rounded-pill px-4 py-1.5"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
            </span>
            <p className="font-mono text-sm text-mint">{t.hero.eyebrow}</p>
          </div>

          <h1 data-reveal className="text-hero font-display text-ink">
            {titleLead ? `${titleLead} ` : ""}
            <span className="aurora-text">{titleAccent}</span>
          </h1>

          <p data-reveal className="mt-6 max-w-lg text-body text-mist">
            {t.hero.subtitle}
          </p>

          {/* ---- quick-proof stats: real numbers pulled from the same data
                 driving Projects/CaseStudies/Experience below, not
                 hand-typed, so the hero can't overclaim ---- */}
          {/* grid-cols-3 on mobile so the three stats sit in even lanes —
              plain flex-wrap let the narrowest one fall onto its own line
              while the other two crowded together on the next, which read
              as lopsided rather than intentional. sm+ reverts to the
              original flex row with dividers, unchanged. */}
          <div
            data-reveal
            className="mt-10 grid grid-cols-3 gap-x-4 gap-y-5 border-y border-line py-6 sm:flex sm:flex-wrap sm:items-center sm:gap-x-8"
          >
            <HeroStat value={`${yearsExperience}+`} label={t.hero.stats.years} />
            <span className="hidden h-8 w-px bg-line sm:block" aria-hidden />
            <HeroStat value={`${t.projects.items.length}+`} label={t.hero.stats.projects} />
            <span className="hidden h-8 w-px bg-line sm:block" aria-hidden />
            <HeroStat value={`${t.caseStudies.items.length}`} label={t.hero.stats.caseStudies} />
          </div>

          <div data-reveal className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton onClick={() => scrollToId("projects")}>
              {t.hero.ctaPrimary}
              <ArrowIcon size={16} />
            </MagneticButton>
            <MagneticButton variant="ghost" onClick={() => scrollToId("contact")}>
              {t.hero.ctaSecondary}
            </MagneticButton>
          </div>
        </div>

        {/* ---- visual column: Spline scene, boxed. Tracks the cursor anywhere
               on the page (see SplineScene.tsx), not just while hovering
               this box. Hidden below md: a WebGL scene sized to fill a
               phone-width column added a full extra screen of blank/loading
               space above the fold with nothing else to show for it. ---- */}
        <div data-reveal className="order-1 hidden md:order-2 md:block">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <SplineScene scene={SPLINE_SCENE_URL} className="h-full w-full" />
          </div>
        </div>
      </div>

      {/* ---- fact rail: current role, local time, newest release and the
             three links people otherwise scroll to Contact for — all read
             from the same data as the sections below (AGENTS.md §3.1) ---- */}
      {/* <div data-reveal className="mt-12 md:mt-16">
        <HeroCluster />
      </div> */}

      {/* ---- scroll cue: purely decorative, points at TechMarquee/About
             right below — respects prefers-reduced-motion globally via the
             animation-duration override in globals.css ---- */}
      <div data-reveal aria-hidden className="mt-10 flex justify-center md:mt-20">
        <div className="flex flex-col items-center gap-2 text-mist">
          <span className="caption">{t.hero.scrollCue}</span>
          <span className="flex h-9 w-5 items-start justify-center rounded-pill border border-line p-1.5">
            <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-mint" />
          </span>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-2xl text-ink">{value}</span>
      <span className="caption mt-1">{label}</span>
    </div>
  );
}

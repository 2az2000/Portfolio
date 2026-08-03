"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { useLanguage } from "@/components/LanguageProvider";
import { useGsapReveal } from "@/lib/useGsapReveal";

/**
 * Problem → Approach → Result reads as a progression, so the three blocks are
 * tinted along the brand's own arc: violet (the open question), amber (the
 * work), mint (the thing that shipped — the same green the site uses for a
 * resolved/positive state everywhere else).
 *
 * The tint stays in the numeral, the dot and the hairline; labels and body
 * copy keep neutral colors so the panel is still readable in light mode,
 * where amber and mint on white would not be.
 */
const STEP_ACCENTS = [
  { dot: "bg-violet", numeral: "text-violet/15", rule: "via-violet/70" },
  { dot: "bg-amber", numeral: "text-amber/15", rule: "via-amber/70" },
  { dot: "bg-mint", numeral: "text-mint/15", rule: "via-mint/70" },
] as const;

export function CaseStudies() {
  const { t, locale } = useLanguage();
  const containerRef = useGsapReveal<HTMLDivElement>({ selector: "[data-reveal]" });
  const items = t.caseStudies.items;

  // Indices rather than titles: the titles are translated, so keying on them
  // would drop the selection every time the language is switched.
  const [active, setActive] = useState("0");

  return (
    <section id="case-studies" className="section-py container" ref={containerRef}>
      <div data-reveal className="mb-12 max-w-2xl">
        <p className="caption mb-3">{t.nav.caseStudies}</p>
        <h2 className="text-h2 font-display text-ink">{t.caseStudies.heading}</h2>
        <p className="mt-3 text-body text-mist">{t.caseStudies.subheading}</p>
      </div>

      <Tabs.Root
        value={active}
        onValueChange={setActive}
        orientation="vertical"
        // Radix resolves its own direction and falls back to "ltr" when no
        // DirectionProvider is mounted, stamping dir="ltr" on this element —
        // which overrides the document's RTL for everything inside, putting
        // the index rail on the wrong side and reversing the arrow keys.
        dir={locale === "fa" ? "rtl" : "ltr"}
        data-reveal
        className="grid gap-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-12"
      >
        {/* The index. A scrollable chip row on phones, a numbered rail on
            desktop — Radix keeps arrow-key navigation correct in both. */}
        <Tabs.List
          aria-label={t.caseStudies.heading}
          className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-s lg:border-line lg:px-0"
        >
          {items.map((cs, i) => (
            <Tabs.Trigger
              key={cs.title}
              value={String(i)}
              className="group relative flex shrink-0 items-center gap-3 rounded-pill border border-line px-4 py-2.5 text-start transition-colors duration-fast ease-brand hover:border-violet/40 data-[state=active]:border-violet/50 data-[state=active]:bg-violet/10 lg:w-full lg:shrink lg:rounded-none lg:border-0 lg:px-5 lg:py-4 lg:hover:bg-ink/[0.03] lg:data-[state=active]:bg-ink/[0.04]"
            >
              <span
                aria-hidden
                className="absolute inset-y-1 start-[-1px] hidden w-0.5 rounded-full bg-violet opacity-0 transition-opacity duration-fast ease-brand group-data-[state=active]:opacity-100 lg:block"
              />
              {/* violet-soft is tuned for the dark surface; on the light
                  theme it drops below the muted text it is meant to
                  outrank, so the solid violet takes over there. */}
              <span className="font-mono text-xs text-mist transition-colors duration-fast group-data-[state=active]:text-violet dark:group-data-[state=active]:text-violet-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm text-mist transition-colors duration-fast group-data-[state=active]:text-ink">
                  {cs.title}
                </span>
                <span className="mt-0.5 hidden truncate text-xs text-mist/70 lg:block">
                  {cs.tagline}
                </span>
              </span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div>
          {items.map((cs, i) => {
            const steps = [
              { ...STEP_ACCENTS[0], label: t.caseStudies.problemLabel, text: cs.problem },
              { ...STEP_ACCENTS[1], label: t.caseStudies.approachLabel, text: cs.approach },
              { ...STEP_ACCENTS[2], label: t.caseStudies.resultLabel, text: cs.result },
            ];

            return (
              // forceMount keeps every case study in the DOM even while
              // hidden, so the copy is still there for search engines and
              // for anyone reading with find-in-page.
              <Tabs.Content
                key={cs.title}
                value={String(i)}
                forceMount
                className="focus-ring rounded-[20px] data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-3 data-[state=active]:duration-500 data-[state=inactive]:hidden"
              >
                <div className="glass rounded-[20px] p-6 md:p-9">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-xl text-ink md:text-2xl">
                        {cs.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-mist">{cs.tagline}</p>
                      <p className="caption mt-3 text-violet dark:text-violet-soft">
                        {cs.role}
                      </p>
                    </div>

                    {/* Internal products with no public URL drop the button
                        rather than offer one that goes nowhere. */}
                    {cs.href !== "#" && (
                      <a
                        href={cs.href}
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring group/live flex shrink-0 items-center gap-1.5 rounded-pill border border-line px-4 py-2 text-sm text-ink transition-colors duration-fast ease-brand hover:border-violet/40"
                      >
                        {t.caseStudies.viewLive}
                        <ArrowUpRight
                          size={14}
                          className="transition-transform duration-fast ease-brand group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5 group-hover/live:text-mint rtl:group-hover/live:-translate-x-0.5"
                        />
                      </a>
                    )}
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {steps.map((step, si) => (
                      <div
                        key={step.label}
                        className="relative overflow-hidden rounded-lg border border-line bg-ink/[0.02] p-5"
                      >
                        <span
                          aria-hidden
                          // Symmetric on purpose: a one-sided gradient would
                          // point the wrong way once the page flips to RTL.
                          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${step.rule} to-transparent`}
                        />
                        <span
                          aria-hidden
                          className={`pointer-events-none absolute end-3 top-1 select-none font-display text-5xl leading-none ${step.numeral}`}
                        >
                          {String(si + 1).padStart(2, "0")}
                        </span>

                        <p className="caption relative flex items-center gap-2 text-ink/70">
                          <span
                            aria-hidden
                            className={`h-1.5 w-1.5 rounded-full ${step.dot}`}
                          />
                          {step.label}
                        </p>
                        <p className="relative mt-3 text-sm leading-relaxed text-mist">
                          {step.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {cs.stack.map((tech) => (
                      <span
                        key={tech}
                        className="caption rounded-pill border border-line px-2.5 py-1"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Tabs.Content>
            );
          })}
        </div>
      </Tabs.Root>
    </section>
  );
}

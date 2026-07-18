"use client";

import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useGsapReveal } from "@/lib/useGsapReveal";

export function CaseStudies() {
  const { t } = useLanguage();
  const containerRef = useGsapReveal<HTMLDivElement>({ selector: "[data-reveal]" });

  return (
    <section id="case-studies" className="section-py container" ref={containerRef}>
      <div data-reveal className="mb-12 max-w-2xl">
        <p className="caption mb-3">{t.nav.caseStudies}</p>
        <h2 className="text-h2 font-display text-ink">{t.caseStudies.heading}</h2>
        <p className="mt-3 text-body text-mist">{t.caseStudies.subheading}</p>
      </div>

      <div className="space-y-6">
        {t.caseStudies.items.map((cs) => (
          <div data-reveal key={cs.title} className="glass rounded-[20px] p-6 md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl text-ink">{cs.title}</h3>
                <p className="mt-1 text-sm text-mist">{cs.tagline}</p>
                <p className="caption mt-3">{cs.role}</p>
              </div>
              <a
                href={cs.href}
                target="_blank"
                rel="noreferrer"
                className="focus-ring flex shrink-0 items-center gap-1.5 rounded-pill border border-line px-4 py-2 text-sm text-ink transition-colors duration-fast ease-brand hover:border-violet/40"
              >
                {t.caseStudies.viewLive} <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <CaseBlock label={t.caseStudies.problemLabel} text={cs.problem} />
              <CaseBlock label={t.caseStudies.approachLabel} text={cs.approach} />
              <CaseBlock label={t.caseStudies.resultLabel} text={cs.result} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {cs.stack.map((tech) => (
                <span key={tech} className="caption rounded-pill border border-line px-2.5 py-1">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CaseBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="caption mb-2">{label}</p>
      <p className="text-sm leading-relaxed text-mist">{text}</p>
    </div>
  );
}

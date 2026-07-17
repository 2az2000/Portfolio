"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { useGsapReveal } from "@/lib/useGsapReveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AnimatedTabs } from "@/components/ui/AnimatedTabs";
import { CommandPalette } from "@/components/ui/CommandPalette";

export function Playground() {
  const { t } = useLanguage();
  const containerRef = useGsapReveal<HTMLDivElement>({ selector: "[data-reveal]" });

  return (
    <section id="playground" className="section-py container" ref={containerRef}>
      <div data-reveal className="my-12 max-w-2xl">
        {/* <p className="caption mb-3">{t.nav.playground}</p> */}
        <h2 className="text-h2 font-display text-ink">{t.playground.heading}</h2>
        <p className="mt-3 text-body text-mist">{t.playground.subheading}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div data-reveal>
          <SpotlightCard fileLabel="spotlight-card.tsx">
            <h3 className="mb-2 font-display text-lg text-ink">Spotlight Card</h3>
            <p className="text-sm text-mist">Move your cursor over this card.</p>
          </SpotlightCard>
        </div>

        <div data-reveal>
          <SpotlightCard fileLabel="magnetic-button.tsx" color="51,230,184">
            <h3 className="mb-4 font-display text-lg text-ink">Magnetic Button</h3>
            <MagneticButton>Hover me</MagneticButton>
          </SpotlightCard>
        </div>

        <div data-reveal>
          <SpotlightCard fileLabel="animated-tabs.tsx" color="255,184,107">
            <h3 className="mb-4 font-display text-lg text-ink">Animated Tabs</h3>
            <AnimatedTabs
              tabs={[
                { id: "one", label: "Overview", content: <p className="text-sm text-mist">A sliding indicator, driven by a single layoutId.</p> },
                { id: "two", label: "Usage", content: <p className="text-sm text-mist">Click between tabs to see it glide.</p> },
              ]}
            />
          </SpotlightCard>
        </div>

        <div data-reveal>
          <SpotlightCard fileLabel="command-palette.tsx">
            <h3 className="mb-4 font-display text-lg text-ink">Command Palette</h3>
            <CommandPalette />
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TechMarquee } from "@/components/ui/TechMarquee";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";
import { XRayRegion } from "@/components/XRayRegion";

/**
 * The page itself. Rendered by both `app/(en)/page.tsx` and
 * `app/(fa)/fa/page.tsx` — the two routes differ only in the locale their
 * layout seeds, never in what they compose.
 */
export function PageContent() {
  return (
    <>
      <main>
        <Navbar />
        {/* Each section is wrapped rather than tagged in place so X-ray mode
            needs no edit inside the section components themselves, and so the
            file chip has a box to hang off that no section's own
            `overflow-hidden` can clip. See components/XRayRegion.tsx. */}
        <XRayRegion id="hero">
          <Hero />
        </XRayRegion>
        <XRayRegion id="marquee">
          <TechMarquee />
        </XRayRegion>
        <XRayRegion id="about">
          <About />
        </XRayRegion>
        <XRayRegion id="skills">
          <Skills />
        </XRayRegion>
        <XRayRegion id="projects">
          <Projects />
        </XRayRegion>
        <XRayRegion id="caseStudies">
          <CaseStudies />
        </XRayRegion>
        <XRayRegion id="experience">
          <Experience />
        </XRayRegion>
        <XRayRegion id="contact">
          <Contact />
        </XRayRegion>
      </main>
      {/* Outside <main>: a <footer> nested inside it is the footer *of* that
          content, not of the page. */}
      <Footer />
    </>
  );
}

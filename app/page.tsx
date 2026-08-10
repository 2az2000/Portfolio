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

// -----------------------------------------------------------------------
// Previous inline hero (kept for reference / rollback). Replaced by the
// dedicated <Hero /> section component — see components/sections/Hero.tsx.
// The old markup mixed SplineScene + HeroCluster directly in the page with
// no text content, no CTA, and no reveal choreography; the new version
// pairs the 3D scene with real headline/CTA copy and the same
// useGsapReveal pattern every other section uses.
//
// <section id="hero" className="section-py container grid items-center gap-10 md:grid-cols-2 mt-24">
//   {/* TODO: headline, subtitle, CTA buttons — read from t.hero.* */}
//   <div className="flex-1 relative">
//     <SplineScene
//       scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
//       className="w-full h-full"
//     />
//   </div>
//   <HeroCluster />
// </section>
// -----------------------------------------------------------------------

export default function Home() {
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

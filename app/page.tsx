import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TechMarquee } from "@/components/ui/TechMarquee";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Contact } from "@/components/sections/Contact";

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
    <main>
      <Navbar />
      <Hero />
      <TechMarquee />
      <About />
      <Skills />
      <Projects />
      <CaseStudies />
      <Experience />
      <Contact />
    </main>
  );
}

"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { useGsapReveal } from "@/lib/useGsapReveal";
import { COLORS } from "@/lib/theme";
import {
  SkillsGraph,
  type SkillNodeData,
  type SkillEdgeData,
  type ClusterConfig,
} from "@/components/ui/SkillsGraph";

/* ------------------------------------------------------------------ */
/*  Graph data (project-specific — lives in the section, not in /ui)   */
/* ------------------------------------------------------------------ */

const NODES: SkillNodeData[] = [
  { id: "react", label: "react", cluster: "frontend", x: 22, y: 28 },
  { id: "next", label: "Next.js", cluster: "frontend", x: 38, y: 14 },
  { id: "ts", label: "typeScript", cluster: "language", x: 50, y: 40 },
  { id: "js", label: "JavaScript", cluster: "language", x: 30, y: 55 },
  { id: "tailwind", label: "Tailwind CSS", cluster: "frontend", x: 14, y: 50 },
  { id: "node", label: "Node.js", cluster: "backend", x: 70, y: 24 },
  { id: "express", label: "Express", cluster: "backend", x: 84, y: 42 },
  { id: "rest", label: "REST APIs", cluster: "backend", x: 66, y: 60 },
  { id: "db", label: "Databases", cluster: "backend", x: 82, y: 74 },
  { id: "git", label: "Git", cluster: "language", x: 46, y: 78 },
];

const EDGES: SkillEdgeData[] = [
  ["react", "next"],
  ["react", "ts"],
  ["next", "ts"],
  ["next", "js"],
  ["ts", "js"],
  ["js", "tailwind"],
  ["react", "tailwind"],
  ["node", "express"],
  ["express", "rest"],
  ["rest", "db"],
  ["node", "ts"],
  ["node", "js"],
  ["node", "rest"],
  ["git", "js"],
  ["git", "rest"],
];

const CLUSTERS: Record<string, ClusterConfig> = {
  frontend: {
    color: COLORS.violet,
    softColor: COLORS.violetSoft,
    label: "Frontend",
  },
  backend: {
    color: COLORS.mint,
    softColor: COLORS.mintSoft,
    label: "Backend",
  },
  language: {
    color: COLORS.amber,
    softColor: COLORS.amber,
    label: "Languages & tools",
  },
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export function Skills() {
  const { t } = useLanguage();
  const containerRef = useGsapReveal<HTMLDivElement>({
    selector: "[data-reveal]",
  });

  return (
    <section id="skills" className="section-py container" ref={containerRef}>
      <div data-reveal className="mb-12 max-w-2xl">
        <h2 className="text-h2 font-display text-ink">
          {t.skills.heading}
        </h2>
        <p className="mt-3 text-body text-mist">{t.skills.subheading}</p>
      </div>

      <div data-reveal>
        <SkillsGraph nodes={NODES} edges={EDGES} clusters={CLUSTERS} />
      </div>
    </section>
  );
}

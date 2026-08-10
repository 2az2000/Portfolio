import type { Dictionary } from "@/lib/i18n";

/**
 * The page's navigable sections, in document order.
 *
 * Shared by the navbar (links + scrollspy) and the command palette, which
 * would otherwise each keep their own copy — and a section added to one list
 * but not the other is exactly the kind of drift nobody notices until a
 * visitor can't find something.
 *
 * `id` is the DOM id on the <section>; `key` indexes `t.nav`, so the label is
 * always the translated one.
 */
export const NAV_SECTIONS = [
  { id: "about", key: "about" },
  { id: "skills", key: "skills" },
  { id: "projects", key: "projects" },
  { id: "case-studies", key: "caseStudies" },
  { id: "experience", key: "experience" },
  { id: "contact", key: "contact" },
] as const satisfies readonly { id: string; key: keyof Dictionary["nav"] }[];

export type NavSection = (typeof NAV_SECTIONS)[number];

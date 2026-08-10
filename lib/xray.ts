/**
 * The X-ray mode's component index.
 *
 * This file is the one place that knows which source file renders which
 * region of the page. Both consumers read from here — the `<XRayRegion>`
 * wrappers that stamp a `data-xray` attribute onto the DOM, and the legend
 * that lists everything — so a renamed component is a one-line change rather
 * than a string to chase through markup.
 *
 * Only the *paths* live here. Every human-readable description is a
 * dictionary key (`t.xray.regions.*` / `t.xray.behavioral.*`), because the
 * whole point of the mode is explaining the page to a visitor, and that
 * explanation has to arrive in the language they're reading.
 */

type RegionSource = {
  /** Shown in the on-page chip — the basename alone, the way devtools would. */
  file: string;
  /** Shown in the legend, so the reader can actually find it in the repo. */
  path: string;
};

/**
 * Regions that occupy a box on the page. The keys double as dictionary keys
 * in `t.xray.regions`, so adding one here without translating it is a type
 * error in both locales rather than a silently blank row.
 */
export const XRAY_REGIONS = {
  navbar: { file: "Navbar.tsx", path: "components/Navbar.tsx" },
  hero: { file: "Hero.tsx", path: "components/sections/Hero.tsx" },
  marquee: { file: "TechMarquee.tsx", path: "components/ui/TechMarquee.tsx" },
  about: { file: "About.tsx", path: "components/sections/About.tsx" },
  skills: { file: "SkillsGraph.tsx", path: "components/ui/SkillsGraph.tsx" },
  projects: { file: "Projects.tsx", path: "components/sections/Projects.tsx" },
  caseStudies: { file: "CaseStudies.tsx", path: "components/sections/CaseStudies.tsx" },
  experience: { file: "Experience.tsx", path: "components/sections/Experience.tsx" },
  contact: { file: "Contact.tsx", path: "components/sections/Contact.tsx" },
  footer: { file: "Footer.tsx", path: "components/Footer.tsx" },
} as const satisfies Record<string, RegionSource>;

export type XRayRegionId = keyof typeof XRAY_REGIONS;

/**
 * The pieces that have no box to outline: they're behaviour layered over the
 * whole document rather than a slice of it. Listing them in the legend is the
 * point — a visitor can see the outlines, but the cursor, the locale curtain
 * and the scroll driver are exactly the parts they've been feeling without
 * being able to point at.
 */
export const XRAY_BEHAVIORAL = {
  cursor: { file: "CustomCursor.tsx", path: "components/CustomCursor.tsx" },
  curtain: { file: "LocaleCurtain.tsx", path: "components/LocaleCurtain.tsx" },
  smoothScroll: { file: "SmoothScroll.tsx", path: "components/SmoothScroll.tsx" },
  reveal: { file: "useGsapReveal.ts", path: "lib/useGsapReveal.ts" },
} as const satisfies Record<string, RegionSource>;

export type XRayBehavioralId = keyof typeof XRAY_BEHAVIORAL;

export const XRAY_REGION_IDS = Object.keys(XRAY_REGIONS) as XRayRegionId[];
export const XRAY_BEHAVIORAL_IDS = Object.keys(XRAY_BEHAVIORAL) as XRayBehavioralId[];

"use client";

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiTailwindcss,
  SiGreensock,
  SiFramer,
  SiGit,
  SiExpress,
} from "react-icons/si";
import type { IconType } from "react-icons";

type MarqueeItem = { label: string; Icon: IconType };

const ITEMS: MarqueeItem[] = [
  { label: "React", Icon: SiReact },
  { label: "Next.js", Icon: SiNextdotjs },
  { label: "TypeScript", Icon: SiTypescript },
  { label: "Node.js", Icon: SiNodedotjs },
  { label: "Express", Icon: SiExpress },
  { label: "Tailwind CSS", Icon: SiTailwindcss },
  { label: "GSAP", Icon: SiGreensock },
  { label: "Framer Motion", Icon: SiFramer },
  { label: "Git", Icon: SiGit },
];

/**
 * A seamless, auto-scrolling strip of the tech stack. Pure CSS (the
 * `animate-marquee` keyframe already defined in tailwind.config.ts) so it
 * costs nothing on the main thread and never needs to be paused/resumed —
 * `prefers-reduced-motion` is handled globally in globals.css.
 *
 * The item list is duplicated once so the loop point (-50%) is invisible.
 */
export function TechMarquee() {
  const track = [...ITEMS, ...ITEMS];

  return (
    <div
      className="relative w-full overflow-hidden border-y border-line py-6"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div className="flex w-max animate-marquee items-center gap-10">
        {track.map((item, i) => (
          <div
            key={`${item.label}-${i}`}
            className="flex shrink-0 items-center gap-2.5 font-mono text-sm text-mist"
          >
            <item.Icon size={18} className="text-mint-soft" />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

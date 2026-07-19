"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
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
import { prefersReducedMotion } from "@/lib/theme";

type MarqueeItem = {
  label: string;
  Icon: IconType;
  /** Official brand hex (from Simple Icons, the source these glyphs come
   *  from). Omitted for logos whose brand color is pure black/white — those
   *  fall back to the theme-aware `text-ink` token instead, since a literal
   *  #000000 icon would be invisible on this site's dark background. */
  color?: string;
};

const ITEMS: MarqueeItem[] = [
  { label: "React", Icon: SiReact, color: "#61DAFB" },
  { label: "Next.js", Icon: SiNextdotjs },
  { label: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { label: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  { label: "Express", Icon: SiExpress },
  { label: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { label: "GSAP", Icon: SiGreensock, color: "#88CE02" },
  { label: "Framer Motion", Icon: SiFramer, color: "#0055FF" },
  { label: "Git", Icon: SiGit, color: "#F05032" },
];

const BASE_SPEED = 40; // px/s
const EASE_FACTOR = 0.06; // how quickly velocity chases its target each frame

/**
 * An auto-scrolling, drag-to-scrub strip of the tech stack — Framer Motion
 * drives a single `x` motion value every frame instead of a CSS keyframe,
 * because a plain CSS animation can neither ease its own speed on hover
 * (`animation-play-state` only snaps instantly to paused/running) nor be
 * grabbed and dragged by the user.
 *
 * The item list is duplicated once so the loop is invisible; that only
 * works if `x` wraps at the *exact* pixel width of one set, so that width
 * is measured in JS (and re-measured on resize/font-load via
 * ResizeObserver) rather than assumed.
 */
export function TechMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0);
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  const x = useMotionValue(0);
  const velocityRef = useRef(BASE_SPEED);
  const targetVelocityRef = useRef(BASE_SPEED);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => setSetWidth(track.scrollWidth / 2);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (reducedMotion || !setWidth || isDraggingRef.current) return;

    // Ease current velocity toward its target (0 on hover, BASE_SPEED
    // otherwise) instead of snapping — this is what makes hovering feel
    // like the strip is gliding to a stop under its own momentum.
    velocityRef.current += (targetVelocityRef.current - velocityRef.current) * EASE_FACTOR;

    let next = x.get() - (velocityRef.current * delta) / 1000;
    if (next <= -setWidth) next += setWidth;
    if (next > 0) next -= setWidth;
    x.set(next);
  });

  const wrapToLoop = () => {
    const current = x.get();
    if (current <= -setWidth) x.set(current + setWidth);
    else if (current > 0) x.set(current - setWidth);
  };

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
      onMouseEnter={() => {
        targetVelocityRef.current = 0;
      }}
      onMouseLeave={() => {
        targetVelocityRef.current = BASE_SPEED;
      }}
    >
      <motion.div
        ref={trackRef}
        className="flex w-max cursor-grab items-center gap-10 active:cursor-grabbing"
        style={{ x }}
        drag={setWidth ? "x" : false}
        dragMomentum={false}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDrag={wrapToLoop}
        onDragEnd={() => {
          isDraggingRef.current = false;
        }}
      >
        {track.map((item, i) => {
          // The second copy exists purely so the loop has something
          // identical to scroll onto — screen readers shouldn't announce
          // the whole stack twice.
          const isDuplicate = i >= ITEMS.length;
          return (
            <motion.div
              key={`${item.label}-${i}`}
              aria-hidden={isDuplicate || undefined}
              whileHover={reducedMotion ? undefined : { scale: 1.14, y: -3 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="flex shrink-0 items-center gap-2.5 rounded-pill border border-transparent px-3 py-1.5 font-mono text-sm text-mist transition-colors duration-fast ease-brand hover:border-line hover:bg-white/[0.04] hover:text-ink hover:shadow-glow"
            >
              <item.Icon
                size={18}
                className={item.color ? undefined : "text-ink"}
                style={item.color ? { color: item.color } : undefined}
              />
              {item.label}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

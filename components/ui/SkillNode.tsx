"use client";

import {
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { EASE_BRAND, prefersReducedMotion } from "@/lib/theme";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type SkillNodeProps = {
  id: string;
  label: string;
  clusterColor: string;
  x: number;
  y: number;
  index: number;
  isHovered: boolean;
  isConnected: boolean;
  isDimmed: boolean;
  onHover: (id: string | null) => void;
};

/* ------------------------------------------------------------------ */
/*  Floating configs — each node gets a unique path / speed / delay    */
/* ------------------------------------------------------------------ */

const FLOAT_CONFIGS = [
  { animation: "skillFloat0", duration: "5.5s", delay: "0s" },
  { animation: "skillFloat1", duration: "6.2s", delay: "0.8s" },
  { animation: "skillFloat2", duration: "7.1s", delay: "1.6s" },
  { animation: "skillFloat3", duration: "5.8s", delay: "0.4s" },
  { animation: "skillFloat4", duration: "6.8s", delay: "1.2s" },
  { animation: "skillFloat0", duration: "7.5s", delay: "2.0s" },
  { animation: "skillFloat1", duration: "5.2s", delay: "0.6s" },
  { animation: "skillFloat2", duration: "6.5s", delay: "1.4s" },
  { animation: "skillFloat3", duration: "7.8s", delay: "0.2s" },
  { animation: "skillFloat4", duration: "6.0s", delay: "1.8s" },
];

const MAGNETIC_RADIUS = 120;
const MAGNETIC_STRENGTH = 14;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SkillNode({
  id,
  label,
  clusterColor,
  x,
  y,
  index,
  isHovered,
  isConnected,
  isDimmed,
  onHover,
}: SkillNodeProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hasRipple, setHasRipple] = useState(false);
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  const float = FLOAT_CONFIGS[index % FLOAT_CONFIGS.length];

  /* ---- magnetic spring ---- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, {
    stiffness: 160,
    damping: 14,
    mass: 0.1,
  });
  const springY = useSpring(my, {
    stiffness: 160,
    damping: 14,
    mass: 0.1,
  });

  /* ---- callbacks ---- */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAGNETIC_RADIUS && dist > 0) {
        const strength = (1 - dist / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH;
        mx.set((dx / dist) * strength);
        my.set((dy / dist) * strength);
      } else {
        mx.set(0);
        my.set(0);
      }
    },
    [mx, my, reducedMotion],
  );

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    onHover(null);
  }, [mx, my, onHover]);

  const handleMouseEnter = useCallback(() => {
    onHover(id);
    setHasRipple(true);
  }, [id, onHover]);

  /* ---- render ----
     Centering (-50%,-50%) is done on a plain, non-motion wrapper via a
     CSS class. The magnetic spring (x/y) lives on the inner <motion.button>
     only. Framer Motion fully owns the `transform` of any element it
     animates x/y on — mixing it with Tailwind's translate-x/y classes on
     the SAME element made Motion silently drop the CSS translate, so
     nodes rendered uncentered and edge nodes (x near 0/100, y near 0/100)
     got pushed outside the container's overflow-hidden bounds, making
     them impossible to hover. Splitting the two transforms onto two
     elements fixes it for every node, not just the central ones. */
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%`, zIndex: isHovered ? 20 : 10 }}
    >
      <motion.button
        ref={ref}
        type="button"
        aria-label={`${label} skill${isHovered ? ", selected" : isConnected ? ", connected" : ""}`}
        tabIndex={0}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => onHover(id)}
        onBlur={() => onHover(null)}
        data-skills-node
        className="focus-ring relative flex cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-xl"
        style={{
          x: springX,
          y: springY,
          borderColor: isHovered
            ? `${clusterColor}cc`
            : isConnected
              ? `${clusterColor}66`
              : `${clusterColor}30`,
          backgroundColor: isHovered
            ? `${clusterColor}1a`
            : `${clusterColor}0d`,
          boxShadow: isHovered
            ? `0 0 28px ${clusterColor}44, 0 8px 32px rgba(0,0,0,0.35)`
            : isConnected
              ? `0 0 18px ${clusterColor}22, 0 4px 16px rgba(0,0,0,0.2)`
              : `0 4px 20px rgba(0,0,0,0.25)`,
          animation: reducedMotion
            ? "none"
            : `${float.animation} ${float.duration} ease-in-out ${float.delay} infinite`,
          opacity: isDimmed ? 0.18 : 1,
          scale: isHovered ? 1.14 : 1,
        }}
        transition={{
          borderColor: { duration: 0.25, ease: EASE_BRAND },
          backgroundColor: { duration: 0.25, ease: EASE_BRAND },
          boxShadow: { duration: 0.3, ease: EASE_BRAND },
          opacity: { duration: 0.3, ease: EASE_BRAND },
          scale: { type: "spring", stiffness: 320, damping: 22 },
        }}
      >
      {/* ---- ripple ring ---- */}
      <AnimatePresence>
        {hasRipple && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full"
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onAnimationComplete={() => setHasRipple(false)}
            style={{ border: `1.5px solid ${clusterColor}` }}
          />
        )}
      </AnimatePresence>

      {/* ---- hover glow aura ---- */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="pointer-events-none absolute -inset-3 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(circle, ${clusterColor}18 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* ---- indicator dot with pulse ---- */}
      <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
        <span
          className="absolute h-full rounded-full"
          style={{ backgroundColor: clusterColor }}
        />
        <AnimatePresence>
          {isHovered && (
            <motion.span
              className="absolute h-full rounded-full"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ backgroundColor: clusterColor }}
            />
          )}
        </AnimatePresence>
      </span>

      {/* ---- label ---- */}
      <span className="font-mono text-ink">{label}</span>
      </motion.button>
    </div>
  );
}

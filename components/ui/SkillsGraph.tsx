"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import { SkillNode } from "./SkillNode";
import { cn } from "@/lib/utils";
import { COLORS, EASE_BRAND, prefersReducedMotion } from "@/lib/theme";

/* ------------------------------------------------------------------ */
/*  Public types                                                       */
/* ------------------------------------------------------------------ */

export type SkillNodeData = {
  id: string;
  label: string;
  cluster: string;
  x: number;
  y: number;
};

export type SkillEdgeData = [string, string];

export type ClusterConfig = {
  color: string;
  softColor: string;
  label: string;
};

type SkillsGraphProps = {
  nodes: SkillNodeData[];
  edges: SkillEdgeData[];
  clusters: Record<string, ClusterConfig>;
  className?: string;
};

/* ------------------------------------------------------------------ */
/*  Decoration                                                         */
/* ------------------------------------------------------------------ */

/**
 * Grain, as one small tile repeated by the compositor instead of a
 * viewport-sized <feTurbulence> rect. Same filter, same look — but the
 * browser runs the (expensive, CPU-side) noise generation once over 140×140
 * pixels rather than over the whole ~1100×420 canvas, and the result is a
 * plain background image that costs nothing to repaint afterwards.
 */
const NOISE_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** The drift keyframes defined in globals.css, reused here so the particles
 *  are pure CSS (compositor-only) rather than 20 JS-driven animations. */
const FLOAT_KEYFRAMES = ["skillFloat0", "skillFloat1", "skillFloat2", "skillFloat3", "skillFloat4"];

const PARTICLE_COUNT = 12;

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.5 + Math.random() * 2.5,
    opacity: 0.12 + Math.random() * 0.18,
    keyframes: FLOAT_KEYFRAMES[i % FLOAT_KEYFRAMES.length],
    duration: 10 + Math.random() * 16,
    delay: Math.random() * 6,
  }));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SkillsGraph({ nodes, edges, clusters, className }: SkillsGraphProps) {
  /* ---- state ---- */
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activePulse, setActivePulse] = useState<SkillEdgeData | null>(null);

  /* ---- refs ---- */
  const containerRef = useRef<HTMLDivElement>(null);

  /* ---- theme ---- */
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Before mount, `theme` hasn't resolved from storage yet — fall back to
  // the site's deterministic default (dark) so SSR and the first client
  // render agree instead of a hydration mismatch (reading useTheme()
  // unguarded forces React to throw away and re-render this whole subtree
  // on first paint).
  const isDark = mounted ? theme === "dark" : true;

  /* ---- reduced motion ---- */
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  /* ---- in-view (entrance trigger, fires once) ---- */
  const isInView = useInView(containerRef, {
    once: true,
    margin: "-12% 0px -12% 0px",
  });

  /* ---- in-view (ongoing) — gates the decorative loops below so they don't
     keep animating (and eating frame budget) once the user has scrolled this
     section out of view ---- */
  const isCurrentlyVisible = useInView(containerRef, {
    margin: "200px 0px 200px 0px",
  });

  const decorate = !reducedMotion && isCurrentlyVisible;

  /* ---- memoised lookups ---- */
  const particles = useMemo(() => generateParticles(PARTICLE_COUNT), []);

  const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  const connectedNodeIds = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    return new Set(
      edges.filter(([a, b]) => a === hoveredId || b === hoveredId).flatMap(([a, b]) => [a, b])
    );
  }, [hoveredId, edges]);

  const activeEdgeKeys = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    return new Set(
      edges.filter(([a, b]) => a === hoveredId || b === hoveredId).map(([a, b]) => `${a}-${b}`)
    );
  }, [hoveredId, edges]);

  /* ---- random energy pulse ---- */
  useEffect(() => {
    if (!decorate) return;
    const id = setInterval(
      () => {
        const edge = edges[Math.floor(Math.random() * edges.length)];
        setActivePulse(edge);
        setTimeout(() => setActivePulse(null), 2200);
      },
      4500 + Math.random() * 3000
    );
    return () => clearInterval(id);
  }, [edges, decorate]);

  /* ---- hover handler (stable ref) ---- */
  const handleNodeHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  /* ---- edge gradients: one <defs> per edge list, not per hover ----
     Hovering a node re-renders this component (that's how the dim/highlight
     works), and without this memo React would rebuild and diff all 15
     gradient definitions on every pointer move between nodes even though
     nothing about them can change. */
  const edgeDefs = useMemo(
    () => (
      <defs>
        {edges.map(([a, b]) => {
          const nA = nodeById[a];
          const nB = nodeById[b];
          if (!nA || !nB) return null;
          const cA = clusters[nA.cluster]?.color ?? COLORS.mist;
          const cB = clusters[nB.cluster]?.color ?? COLORS.mist;
          return (
            <linearGradient
              key={`eg-${a}-${b}`}
              id={`edge-grad-${a}-${b}`}
              x1={nA.x}
              y1={nA.y}
              x2={nB.x}
              y2={nB.y}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={cA} stopOpacity="0.55" />
              <stop offset="100%" stopColor={cB} stopOpacity="0.55" />
            </linearGradient>
          );
        })}
      </defs>
    ),
    [edges, nodeById, clusters]
  );

  /* ---- entrance variants ---- */
  const bgVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.9, ease: EASE_BRAND } },
  };

  const edgeContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.035, delayChildren: 0.35 },
    },
  };

  const edgeVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: EASE_BRAND },
    },
  };

  const nodeContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.065, delayChildren: 0.6 },
    },
  };

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.4, y: 24 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  };

  const legendVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE_BRAND, delay: 1.1 },
    },
  };

  /* ---- render ---- */
  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line",
        // min-h paired with aspect-ratio on a block box: if the ratio's
        // height (derived from full container width) comes in under
        // min-h, the box satisfies min-h by growing WIDTH instead — which
        // pushed this wider than the viewport on narrow phones (aspect-ratio
        // spec behavior, not a Tailwind bug). Each breakpoint's min-h stays
        // at or below what its own aspect-ratio already yields at realistic
        // widths, so min-h only ever raises height, never triggers that.
        "min-h-[190px] aspect-[4/3]",
        "sm:aspect-[16/10]",
        "md:aspect-[21/9] md:min-h-[420px]",
        className
      )}
    >
      {/* ================================================================
          BACKGROUND

          Everything in here is static paint or a CSS keyframe. The earlier
          version animated 20 particles and 3 blurred orbs through Framer
          Motion, and the orbs animated `scale` — scaling an 80px-blurred
          layer forces the browser to re-rasterize that blur every single
          frame, for the whole time the section is on screen. That, plus a
          full-canvas <feTurbulence> and a backdrop-blur on each of the ten
          nodes, is what made this section expensive; none of it was
          load-bearing for the design.
          ================================================================ */}
      <motion.div
        data-skills-bg
        variants={bgVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="pointer-events-none absolute inset-0"
      >
        {/* grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)"
              : "linear-gradient(rgba(0,0,0,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.035) 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* radial colour washes */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? `radial-gradient(ellipse 55% 50% at 22% 28%,${COLORS.violet}16,transparent),radial-gradient(ellipse 50% 55% at 78% 62%,${COLORS.mint}12,transparent),radial-gradient(ellipse 38% 38% at 58% 18%,${COLORS.amber}0d,transparent)`
              : `radial-gradient(ellipse 55% 50% at 22% 28%,${COLORS.violet}0c,transparent),radial-gradient(ellipse 50% 55% at 78% 62%,${COLORS.mint}09,transparent),radial-gradient(ellipse 38% 38% at 58% 18%,${COLORS.amber}07,transparent)`,
          }}
        />

        {/* noise texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: NOISE_TILE, backgroundSize: "140px 140px" }}
        />

        {/* ambient glow orbs — translate only, never scale (see above) */}
        {decorate && (
          <>
            <div
              className="absolute rounded-full blur-[80px]"
              style={{
                width: 260,
                height: 260,
                left: "12%",
                top: "18%",
                background: `radial-gradient(circle,${COLORS.violet}1a,transparent)`,
                animation: "ambientDrift1 24s ease-in-out infinite",
              }}
            />
            <div
              className="absolute rounded-full blur-[70px]"
              style={{
                width: 220,
                height: 220,
                right: "8%",
                bottom: "12%",
                background: `radial-gradient(circle,${COLORS.mint}16,transparent)`,
                animation: "ambientDrift2 20s ease-in-out infinite",
                animationDelay: "-3s",
              }}
            />
          </>
        )}

        {/* floating particles */}
        {decorate &&
          particles.map((p) => (
            <span
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                backgroundColor: isDark
                  ? `rgba(255,255,255,${p.opacity})`
                  : `rgba(0,0,0,${p.opacity * 0.5})`,
                animation: `${p.keyframes} ${p.duration}s ease-in-out ${p.delay}s infinite`,
              }}
            />
          ))}
      </motion.div>

      {/* ================================================================
          SVG EDGES
          ================================================================ */}
      <motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ zIndex: 1 }}
        variants={edgeContainerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {edgeDefs}

        {edges.map(([a, b]) => {
          const nA = nodeById[a];
          const nB = nodeById[b];
          if (!nA || !nB) return null;

          const key = `${a}-${b}`;
          const isActive = activeEdgeKeys.has(key);
          const isPulse = activePulse?.[0] === a && activePulse?.[1] === b;
          const cA = clusters[nA.cluster]?.color ?? COLORS.mist;

          return (
            <motion.g key={key} variants={edgeVariants}>
              {/* base line */}
              <line
                x1={nA.x}
                y1={nA.y}
                x2={nB.x}
                y2={nB.y}
                stroke={`url(#edge-grad-${a}-${b})`}
                strokeWidth={isActive ? 0.32 : 0.14}
                style={{
                  transition:
                    "stroke-width 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)",
                  opacity: hoveredId && !isActive ? 0.12 : 0.55,
                }}
              />

              {/* Flowing dashes along the hovered node's edges. One CSS
                  keyframe on stroke-dashoffset replaces what used to be a
                  SMIL <animate> plus three <animateMotion> dots per edge —
                  each of those rendered through a feGaussianBlur filter, so
                  hovering a well-connected node meant re-running a blur over
                  a dozen moving elements every frame. */}
              {isActive && (
                <line
                  x1={nA.x}
                  y1={nA.y}
                  x2={nB.x}
                  y2={nB.y}
                  stroke={cA}
                  strokeWidth={0.22}
                  strokeDasharray="1.2 2.8"
                  style={{
                    opacity: 0.9,
                    animation: reducedMotion ? "none" : "skillEdgeFlow 1.4s linear infinite",
                  }}
                />
              )}

              {/* random pulse glow */}
              {isPulse && (
                <line
                  x1={nA.x}
                  y1={nA.y}
                  x2={nB.x}
                  y2={nB.y}
                  stroke={COLORS.violetSoft}
                  strokeWidth={0.45}
                  // opacity starts at 0 so the line can't flash at full
                  // strength for the one frame before the animation applies.
                  style={{ opacity: 0, animation: "skillEdgePulse 2.2s ease-in-out forwards" }}
                />
              )}
            </motion.g>
          );
        })}
      </motion.svg>

      {/* ================================================================
          NODES
          ================================================================ */}
      <motion.div
        className="absolute inset-0"
        style={{ zIndex: 2 }}
        variants={nodeContainerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {nodes.map((node, i) => {
          const isNodeHovered = hoveredId === node.id;
          const isNodeConnected = connectedNodeIds.has(node.id);
          const isDimmed = hoveredId !== null && !isNodeHovered && !isNodeConnected;

          return (
            <motion.div
              key={node.id}
              variants={nodeVariants}
              // pointerEvents: "none" is the fix — without it, every node's
              // full-size (inset: 0) positioning wrapper stacks on top of
              // all earlier nodes' wrappers and swallows their hover/click
              // events, since a transparent div still captures pointer
              // events by default. The actual <SkillNode> button re-enables
              // pointer-events itself, so hover reaches the right node again.
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            >
              <SkillNode
                id={node.id}
                label={node.label}
                clusterColor={clusters[node.cluster]?.color ?? COLORS.mist}
                x={node.x}
                y={node.y}
                index={i}
                isHovered={isNodeHovered}
                isConnected={isNodeConnected}
                isDimmed={isDimmed}
                onHover={handleNodeHover}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* ================================================================
          LEGEND
          ================================================================ */}
      <motion.div
        data-skills-legend
        className="absolute bottom-3 start-3 flex flex-wrap gap-2 sm:bottom-5 sm:start-5"
        style={{ zIndex: 3 }}
        variants={legendVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {Object.entries(clusters).map(([key, cfg]) => (
          <motion.div
            key={key}
            className="glass flex select-none items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span
                className="absolute h-full rounded-full"
                style={{ backgroundColor: cfg.color }}
              />
              {/* Tailwind's CSS `animate-ping` instead of a Framer keyframe
                  loop: three infinite JS animations for three 8px dots is
                  frame budget spent on nothing. */}
              {decorate && (
                <span
                  className="absolute h-full animate-ping rounded-full opacity-60"
                  style={{ backgroundColor: cfg.color }}
                />
              )}
            </span>
            <span className="text-ink">{cfg.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

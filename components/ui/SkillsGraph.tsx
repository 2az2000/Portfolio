"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { SkillNode } from "./SkillNode";
import { cn } from "@/lib/utils";
import {
  COLORS,
  EASE_BRAND,
  prefersReducedMotion,
} from "@/lib/theme";

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
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.5 + Math.random() * 2.5,
    opacity: 0.12 + Math.random() * 0.18,
    duration: 10 + Math.random() * 16,
    delay: Math.random() * 6,
  }));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SkillsGraph({
  nodes,
  edges,
  clusters,
  className,
}: SkillsGraphProps) {
  /* ---- state ---- */
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activePulse, setActivePulse] = useState<SkillEdgeData | null>(null);

  /* ---- refs ---- */
  const containerRef = useRef<HTMLDivElement>(null);

  /* ---- theme ---- */
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /* ---- reduced motion ---- */
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  /* ---- in-view (entrance trigger, fires once) ---- */
  const isInView = useInView(containerRef, {
    once: true,
    margin: "-12% 0px -12% 0px",
  });

  /* ---- in-view (ongoing) — gates the infinite decorative loops below so
     they don't keep animating (and eating frame budget) once the user has
     scrolled this section out of view ---- */
  const isCurrentlyVisible = useInView(containerRef, {
    margin: "200px 0px 200px 0px",
  });

  /* ---- memoised lookups ---- */
  const particles = useMemo(() => generateParticles(20), []);

  const nodeById = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])),
    [nodes],
  );

  const connectedNodeIds = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    return new Set(
      edges
        .filter(([a, b]) => a === hoveredId || b === hoveredId)
        .flatMap(([a, b]) => [a, b]),
    );
  }, [hoveredId, edges]);

  const activeEdgeKeys = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    return new Set(
      edges
        .filter(([a, b]) => a === hoveredId || b === hoveredId)
        .map(([a, b]) => `${a}-${b}`),
    );
  }, [hoveredId, edges]);

  /* ---- random energy pulse ---- */
  useEffect(() => {
    if (reducedMotion || !isCurrentlyVisible) return;
    const id = setInterval(
      () => {
        const edge = edges[Math.floor(Math.random() * edges.length)];
        setActivePulse(edge);
        setTimeout(() => setActivePulse(null), 2200);
      },
      4500 + Math.random() * 3000,
    );
    return () => clearInterval(id);
  }, [edges, reducedMotion, isCurrentlyVisible]);

  /* ---- hover handler (stable ref) ---- */
  const handleNodeHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

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
        "min-h-[340px] aspect-[4/3]",
        "sm:aspect-[16/10]",
        "md:aspect-[21/9] md:min-h-[420px]",
        className,
      )}
    >
      {/* ================================================================
          BACKGROUND
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
        <svg className="absolute inset-0 h-full w-full opacity-[0.035]">
          <filter id="skills-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#skills-noise)" />
        </svg>

        {/* floating particles */}
        {!reducedMotion &&
          isCurrentlyVisible &&
          particles.map((p) => (
            <motion.div
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
              }}
              animate={{
                y: [0, -18, 10, -14, 0],
                x: [0, 7, -5, 10, 0],
                opacity: [
                  p.opacity,
                  p.opacity * 1.6,
                  p.opacity * 0.4,
                  p.opacity * 1.3,
                  p.opacity,
                ],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.delay,
              }}
            />
          ))}

        {/* ambient glow orbs */}
        {!reducedMotion && isCurrentlyVisible && (
          <>
            <motion.div
              className="absolute rounded-full blur-[80px]"
              style={{
                width: 260,
                height: 260,
                left: "12%",
                top: "18%",
                background: `radial-gradient(circle,${COLORS.violet}1a,transparent)`,
              }}
              animate={{
                x: [0, 35, -20, 0],
                y: [0, -28, 18, 0],
                scale: [1, 1.12, 0.92, 1],
              }}
              transition={{
                duration: 24,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute rounded-full blur-[70px]"
              style={{
                width: 220,
                height: 220,
                right: "8%",
                bottom: "12%",
                background: `radial-gradient(circle,${COLORS.mint}16,transparent)`,
              }}
              animate={{
                x: [0, -28, 22, 0],
                y: [0, 20, -22, 0],
                scale: [1, 0.92, 1.08, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
            />
            <motion.div
              className="absolute rounded-full blur-[60px]"
              style={{
                width: 170,
                height: 170,
                left: "52%",
                top: "8%",
                background: `radial-gradient(circle,${COLORS.amber}10,transparent)`,
              }}
              animate={{
                x: [0, 18, -14, 0],
                y: [0, -14, 22, 0],
                scale: [1, 1.08, 0.95, 1],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 5,
              }}
            />
          </>
        )}
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
        <defs>
          {/* per-edge gradients */}
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

          {/* glow filter */}
          <filter id="edge-glow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="0.7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {edges.map(([a, b]) => {
          const nA = nodeById[a];
          const nB = nodeById[b];
          if (!nA || !nB) return null;

          const key = `${a}-${b}`;
          const isActive = activeEdgeKeys.has(key);
          const isPulse =
            activePulse?.[0] === a && activePulse?.[1] === b;
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

              {/* flowing dashes (hover) */}
              {isActive && (
                <line
                  x1={nA.x}
                  y1={nA.y}
                  x2={nB.x}
                  y2={nB.y}
                  stroke={cA}
                  strokeWidth={0.18}
                  strokeDasharray="1.2 2.8"
                  filter="url(#edge-glow)"
                  style={{ opacity: 0.85 }}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-8"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                </line>
              )}

              {/* energy dots travelling along edge (hover) */}
              {isActive &&
                [0, 1, 2].map((di) => (
                  <circle
                    key={di}
                    r="0.45"
                    fill={cA}
                    opacity="0.85"
                    filter="url(#edge-glow)"
                  >
                    <animateMotion
                      dur="2.2s"
                      repeatCount="indefinite"
                      begin={`${di * 0.7}s`}
                      path={`M ${nA.x} ${nA.y} L ${nB.x} ${nB.y}`}
                    />
                  </circle>
                ))}

              {/* random pulse glow */}
              {isPulse && (
                <line
                  x1={nA.x}
                  y1={nA.y}
                  x2={nB.x}
                  y2={nB.y}
                  stroke={COLORS.violetSoft}
                  strokeWidth={0.45}
                  filter="url(#edge-glow)"
                >
                  <animate
                    attributeName="opacity"
                    values="0;0.55;0"
                    dur="2.2s"
                    fill="freeze"
                  />
                </line>
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
          const isDimmed =
            hoveredId !== null && !isNodeHovered && !isNodeConnected;

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
        className="absolute bottom-3 left-3 flex flex-wrap gap-2 sm:bottom-5 sm:left-5"
        style={{ zIndex: 3 }}
        variants={legendVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {Object.entries(clusters).map(([key, cfg]) => (
          <motion.div
            key={key}
            className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-mono select-none"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span
                className="absolute h-full rounded-full"
                style={{ backgroundColor: cfg.color }}
              />
              {!reducedMotion && isCurrentlyVisible && (
                <motion.span
                  className="absolute h-full rounded-full"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
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

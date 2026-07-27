"use client";

import { motion, type Variants } from "framer-motion";
import { SpotlightCard } from "./SpotlightCard";
import type { SkillNodeData, ClusterConfig } from "./SkillsGraph";

type SkillsMobileProps = {
  nodes: SkillNodeData[];
  clusters: Record<string, ClusterConfig>;
};

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

/** SpotlightCard's tint wants "r,g,b"; cluster colors come in as "#rrggbb". */
function hexToRgb(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

/**
 * The desktop SkillsGraph is a canvas-shaped node/edge diagram — its x/y
 * layout is authored for a wide (16:10 / 21:9) box and has no readable
 * translation to a narrow, tall phone screen (nodes collide, the legend
 * overlaps nodes). Mobile gets its own reading order instead of a shrunk
 * copy: the same clusters and skills as a vertical stack of SpotlightCards
 * — the same card component Projects/Experience already use, so it reads
 * as part of the same design system rather than a bolted-on fallback.
 */
export function SkillsMobile({ nodes, clusters }: SkillsMobileProps) {
  const groups = Object.entries(clusters).map(([key, config]) => ({
    key,
    config,
    items: nodes.filter((n) => n.cluster === key),
  }));

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div data-reveal key={group.key}>
          <SpotlightCard color={hexToRgb(group.config.color)} className="p-5">
            <div className="mb-4 flex items-center gap-3 border-b border-line pb-4">
              <span
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
                style={{
                  borderColor: `${group.config.color}40`,
                  backgroundColor: `${group.config.color}14`,
                  boxShadow: `0 0 20px ${group.config.color}22`,
                }}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: group.config.color }}
                />
                <span
                  className="absolute h-2.5 w-2.5 animate-ping rounded-full opacity-60"
                  style={{ backgroundColor: group.config.color }}
                />
              </span>
              <div>
                <p className="font-display text-base text-ink">{group.config.label}</p>
                <p className="caption mt-0.5">
                  {group.items.length} {group.items.length === 1 ? "skill" : "skills"}
                </p>
              </div>
            </div>

            <motion.div
              className="flex flex-wrap gap-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
              variants={listVariants}
            >
              {group.items.map((item) => (
                <motion.span
                  key={item.id}
                  variants={chipVariants}
                  whileTap={{ scale: 0.94 }}
                  className="flex items-center gap-2 rounded-pill border px-3.5 py-2 font-mono text-sm text-ink backdrop-blur-md"
                  style={{
                    borderColor: `${group.config.color}30`,
                    backgroundColor: `${group.config.color}0d`,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: group.config.color }}
                  />
                  {item.label}
                </motion.span>
              ))}
            </motion.div>
          </SpotlightCard>
        </div>
      ))}
    </div>
  );
}

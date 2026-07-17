"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_BRAND } from "@/lib/theme";

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

type AnimatedTabsProps = {
  tabs: Tab[];
  defaultTabId?: string;
  className?: string;
};

/**
 * Tabs with a single shared indicator that slides between them using
 * layoutId — the indicator is one element that Framer Motion animates
 * between positions, not a separate element per tab.
 */
export function AnimatedTabs({ tabs, defaultTabId, className }: AnimatedTabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id);
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        className="relative flex gap-1 rounded-pill border border-line bg-white/[0.03] p-1"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(tab.id)}
              className={cn(
                "focus-ring relative z-10 flex-1 rounded-pill px-4 py-2 text-sm font-medium transition-colors duration-fast ease-brand",
                isActive ? "text-void" : "text-mist hover:text-ink"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="animated-tabs-indicator"
                  className="absolute inset-0 -z-10 rounded-pill bg-mint"
                  transition={{ duration: 0.35, ease: EASE_BRAND }}
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <motion.div
          key={activeTab.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_BRAND }}
        >
          {activeTab.content}
        </motion.div>
      </div>
    </div>
  );
}

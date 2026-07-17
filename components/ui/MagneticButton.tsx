"use client";

import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  /** How far the button can travel toward the cursor, in px. */
  strength?: number;
  variant?: "primary" | "ghost";
};

/**
 * A button that gently pulls toward the cursor as it enters a padded zone
 * around it, and snaps back on leave. Desktop-only in effect: on touch
 * devices pointer events simply won't fire the way this expects, so it
 * degrades to a normal button automatically.
 */
export function MagneticButton({
  children,
  strength = 22,
  variant = "primary",
  className,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / rect.width) * strength);
    y.set((relY / rect.height) * strength);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-sm font-medium transition-colors duration-fast ease-brand",
        variant === "primary"
          ? "bg-violet text-ink hover:bg-violet-soft"
          : "border border-line bg-transparent text-ink hover:border-violet/50 dark:hover:border-white/30",
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE_SELECTOR = 'a, button, [data-cursor="magnetic"], input, textarea';

/**
 * Subtle custom cursor: a small dot that grows and softens over interactive
 * elements. Only mounts on devices with a precise pointer (desktop mouse) —
 * never on touch, per AGENTS.md §6.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 28, stiffness: 300, mass: 0.4 });
  const springY = useSpring(y, { damping: 28, stiffness: 300, mass: 0.4 });

  const rafRef = useRef<number>();

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: PointerEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        x.set(e.clientX);
        y.set(e.clientY);
        setIsVisible(true);
      });
      const target = e.target as HTMLElement;
      setIsHoveringInteractive(Boolean(target.closest(INTERACTIVE_SELECTOR)));
    };

    const handleLeave = () => setIsVisible(false);

    window.addEventListener("pointermove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
      style={{ x: springX, y: springY, opacity: isVisible ? 1 : 0 }}
    >
      <motion.div
        className="rounded-full bg-ink"
        animate={{
          width: isHoveringInteractive ? 48 : 10,
          height: isHoveringInteractive ? 48 : 10,
          x: isHoveringInteractive ? -24 : -5,
          y: isHoveringInteractive ? -24 : -5,
          opacity: isHoveringInteractive ? 0.5 : 1,
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

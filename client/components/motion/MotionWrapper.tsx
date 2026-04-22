"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  /** Framer Motion preset: "fade" | "slide-up" | "scale" */
  preset?: "fade" | "slide-up" | "scale";
}

const presets = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 16 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 },
  },
} as const;

/**
 * Reusable Framer Motion wrapper with built-in animation presets.
 *
 * Usage:
 *   <MotionWrapper preset="slide-up">
 *     <MyComponent />
 *   </MotionWrapper>
 */
export function MotionWrapper({
  children,
  preset = "fade",
  ...props
}: MotionWrapperProps) {
  const animation = presets[preset];
  return (
    <motion.div {...animation} {...props}>
      {children}
    </motion.div>
  );
}

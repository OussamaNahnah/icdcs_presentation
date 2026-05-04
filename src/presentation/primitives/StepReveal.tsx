import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useSlideController } from "../useSlideController";

interface StepRevealProps {
  /** Step index at which this content first appears (0 = always visible) */
  at: number;
  children: ReactNode;
  className?: string;
  /** If true, fades out instead of staying visible after future steps */
  exitAfter?: number;
}

export function StepReveal({ at, children, className, exitAfter }: StepRevealProps) {
  const step = useSlideController((s) => s.step);
  const visible = step >= at && (exitAfter === undefined || step <= exitAfter);

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 8,
        filter: visible ? "blur(0px)" : "blur(4px)",
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      {children}
    </motion.div>
  );
}

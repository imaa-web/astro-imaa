import { motion, useReducedMotion, type Easing } from "motion/react";
import type { ReactNode } from "react";

interface AnimatedFadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const ease: Easing = "easeOut";

export default function AnimatedFadeUp({ children, delay = 0, className }: Readonly<AnimatedFadeUpProps>) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease, delay: shouldReduceMotion ? 0 : delay }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

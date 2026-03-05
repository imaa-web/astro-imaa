import { motion, useReducedMotion, type Easing } from "motion/react";
import type { ReactNode } from "react";

interface AnimatedImageWrapperProps {
  children: ReactNode;
  className?: string;
}

const ease: Easing = "easeOut";

export default function AnimatedImageWrapper({ children, className }: Readonly<AnimatedImageWrapperProps>) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 32 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease, delay: 0.3 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

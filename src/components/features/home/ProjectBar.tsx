import { motion } from "motion/react";

interface ProjectBarProps {
  colorClass: string;
  index: number;
}

export default function ProjectBar({ colorClass, index }: Readonly<ProjectBarProps>) {
  return (
    <motion.div
      className={`absolute left-0 top-0 w-1 h-full rounded-full origin-top ${colorClass}`}
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 + index * 0.15 }}
      viewport={{ once: true, amount: 0.2 }}
    />
  );
}

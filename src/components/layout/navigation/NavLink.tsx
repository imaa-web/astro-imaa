import { cn } from "@/lib/utils/ui-utils";
import { motion } from "motion/react";

const linkClass = cn(
  "relative px-3 py-2 text-sm text-primary font-bold tracking-wide font-sans rounded-sm whitespace-nowrap",
  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full",
  "after:bg-linear-to-r after:from-primary after:via-secondary after:via-50% after:to-accent",
  "after:transition-transform after:duration-200 after:origin-left",
);

interface Props {
  href: string;
  label: string;
  active: boolean;
}

export default function NavLink({ href, label, active }: Readonly<Props>) {
  return (
    <a
      href={href}
      className={cn(linkClass, active ? "after:hidden" : "after:scale-x-0 hover:after:scale-x-100")}
      aria-current={active ? "page" : undefined}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r from-primary via-secondary via-50% to-accent"
          transition={{ duration: 0.2 }}
        />
      )}
    </a>
  );
}

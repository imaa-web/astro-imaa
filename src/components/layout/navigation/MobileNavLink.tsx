import { cn } from "@/lib/utils/ui-utils";

const mobileUnderlineClass = cn(
  "relative inline-block",
  "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full",
  "after:bg-linear-to-r after:from-primary after:via-secondary after:via-50% after:to-accent",
  "after:transition-transform after:duration-200 after:origin-left",
);

interface Props {
  href: string;
  label: string;
  active: boolean;
  className?: string;
}

export default function MobileNavLink({ href, label, active, className }: Readonly<Props>) {
  return (
    <a
      href={href}
      className={cn("px-4 py-3 text-sm text-primary font-bold tracking-wide font-sans", className)}
      aria-current={active ? "page" : undefined}
    >
      <span className={cn(mobileUnderlineClass, active ? "after:scale-x-100" : "after:scale-x-0")}>{label}</span>
    </a>
  );
}

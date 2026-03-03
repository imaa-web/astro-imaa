import MobileNavLink from "@/components/layout/navigation/MobileNavLink";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { QueryMenuItem } from "@/lib/sanity-derived-types";
import { buildUrlFromSlug } from "@/lib/utils/string-utils";

interface MobileAccordionItemProps {
  item: QueryMenuItem;
  currentPath: string;
}

export default function MobileAccordionItem({ item, currentPath }: Readonly<MobileAccordionItemProps>) {
  return (
    <AccordionItem value={item._key} className="border-none">
      <AccordionTrigger className="relative px-4 py-3 text-sm text-primary font-bold tracking-wide font-sans hover:no-underline [&>svg]:text-primary">
        {item.label}
      </AccordionTrigger>
      <AccordionContent className="pb-1">
        <div className="flex flex-col gap-1 pl-2 border-l-2 border-primary ml-6">
          {item.submenu?.map((child) => {
            const childHref = buildUrlFromSlug(child.slug ?? "");
            const childActive = currentPath.replace(/\/$/, "") === childHref.replace(/\/$/, "");
            return (
              <MobileNavLink
                key={child._key}
                href={childHref}
                label={child.label ?? ""}
                active={childActive}
                className="pl-2 pr-4 py-2.5 font-medium"
              />
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

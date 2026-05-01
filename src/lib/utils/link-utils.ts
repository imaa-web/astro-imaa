import type { QueryFooterMenuItems, QueryMenuItem } from "@/lib/sanity-derived-types";
import { buildUrlFromSlug, labelToCamelCase } from "@/lib/utils/string-utils";

const SAFE_SCHEMES = ["https://", "mailto:", "tel:", "#", "./", "../"];

/**
 * Validates and sanitizes a raw href string.
 * Returns the trimmed href if safe, "" if unsafe (to trigger UI warning), or null if empty.
 */
export function resolveSafeHref(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  const isSafe =
    SAFE_SCHEMES.some((s) => lower.startsWith(s)) || (trimmed.startsWith("/") && !trimmed.startsWith("//"));
  return isSafe ? trimmed : "";
}

interface CtaData {
  label?: string | null;
  linkType?: string | null;
  slug?: string | null;
  externalUrl?: string | null;
  openInNewTab?: boolean | null;
}

interface ResolvedCta {
  href: string;
  isExternal: boolean;
  openInNewTab: boolean;
}

/**
 * Resolves a CTA object into a normalized href + link behavior.
 * Returns null if the CTA has no valid destination.
 */
export function resolveCta(cta: CtaData): ResolvedCta | null {
  if (cta.linkType === "external") {
    if (!cta.externalUrl) return null;
    const safe = resolveSafeHref(cta.externalUrl);
    if (!safe) return null;
    return { href: safe, isExternal: true, openInNewTab: cta.openInNewTab ?? true };
  }

  const slug = cta.slug;
  if (!slug) return null;
  return { href: buildUrlFromSlug(slug), isExternal: false, openInNewTab: false };
}

/**
 * Normalizes an array of menu items for header navigation.
 * Removes invalid entries, normalizes submenu as array, and ensures stable fallback keys.
 */
export function normalizeMenuItems(items: QueryMenuItem[] | null | undefined): QueryMenuItem[] {
  return (items ?? []).flatMap((item, index) => {
    if (!item?.label) return [];

    const itemLabelSegment = labelToCamelCase(item.label) || "item";
    const parentKey = item._key ?? `menu-${itemLabelSegment}-${index}`;

    const submenu = (item.submenu ?? []).flatMap((subItem, subIndex) => {
      if (!subItem?.label || !subItem?.slug) return [];

      const subItemLabelSegment = labelToCamelCase(subItem.label) || "item";
      return [
        {
          ...subItem,
          _key: subItem._key ?? `${parentKey}-sub-${subItemLabelSegment}-${subIndex}`,
        },
      ];
    });

    const hasChildren = submenu.length > 0;
    const hasHref = Boolean(item.slug);
    if (!hasChildren && !hasHref) return [];

    return [
      {
        ...item,
        _key: parentKey,
        submenu,
      },
    ];
  });
}

export type FlatMenuItem = {
  key: string;
  label: string;
  href: string;
};

/**
 * Normalizes menu items for flat footer navigation.
 */
export function normalizeFlatMenuItems(items: QueryFooterMenuItems | null | undefined): FlatMenuItem[] {
  return (items ?? []).flatMap((item, index) => {
    if (!item?.label || !item?.slug) return [];

    const labelSegment = labelToCamelCase(item.label) || "item";
    const key = item._key ?? `flat-menu-${labelSegment}-${index}`;

    return [
      {
        key,
        label: item.label,
        href: buildUrlFromSlug(item.slug),
      },
    ];
  });
}

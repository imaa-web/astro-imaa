export function buildUrlFromSlug(slug: string | null | undefined): string {
  if (!slug) return "/";
  if (slug === "home") return "/";
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function getLabel<T extends { label: string | null }>(item: T): string {
  return item.label || "";
}

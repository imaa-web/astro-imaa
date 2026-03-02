export function buildUrlFromSlug(slug: string | null | undefined): string {
  if (!slug) return "/";
  if (slug === "inicio") return "/";
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function labelToCamelCase(label: string): string {
  return (
    label
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim()
      .split(/\s+/)
      .map((word, i) => (i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
      .join("") || "field"
  );
}

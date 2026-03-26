import { loadQuery } from "@/lib/load-query";
import type { APIRoute } from "astro";
import { defineQuery } from "groq";

const SITE = import.meta.env.SITE ?? "https://www.institutomaestroabiud.org.br";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const ALL_SLUGS_QUERY = defineQuery(`{
  "pages": *[_type == "page" && defined(slug.current)]{"slug": slug.current},
  "transparencySections": *[_type == "transparencySection" && defined(slug.current)]{"slug": slug.current}
}`);

export const GET: APIRoute = async () => {
  let data: { pages: { slug: string }[]; transparencySections: { slug: string }[] } | null = null;

  try {
    const result = await loadQuery<{
      pages: { slug: string }[];
      transparencySections: { slug: string }[];
    }>({ query: ALL_SLUGS_QUERY });
    data = result.data;
  } catch (error) {
    console.error("Failed to fetch slugs for sitemap:", error);
    // Continue with static pages only
  }

  const staticPages = ["/", "/contato", "/transparencia"];
  const pageUrls = (data?.pages ?? []).map((p) => `/${p.slug}`);
  const transparencyUrls = (data?.transparencySections ?? []).map((s) => `/transparencia/${s.slug}`);

  const allUrls = [...new Set([...staticPages, ...pageUrls, ...transparencyUrls])];
  const lastmod = new Date().toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((url) => `  <url><loc>${escapeXml(`${SITE}${url}`)}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};

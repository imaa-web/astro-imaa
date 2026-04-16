import type { APIRoute } from "astro";

const SITE_URL = import.meta.env.SITE;

const productionRobots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap-index.xml
`;

const previewRobots = `User-agent: *
Disallow: /
`;

export const GET: APIRoute = () => {
  const isPreview = import.meta.env.PUBLIC_DEPLOY_MODE === "preview";

  return new Response(isPreview ? previewRobots : productionRobots, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

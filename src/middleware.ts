import { fetchSiteSettings } from "@/lib/data/fetch-site-settings";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/lib/sanity.types";
import { defineMiddleware } from "astro:middleware";

let buildTimeCache: SITE_SETTINGS_QUERY_RESULT | null | undefined = undefined;

export const onRequest = defineMiddleware(async ({ locals, request, rewrite }, next) => {
  const pathname = new URL(request.url).pathname;
  const isApiRoute = pathname.startsWith("/api/");
  const isPreview = import.meta.env.PUBLIC_DEPLOY_MODE === "preview";

  try {
    if (isPreview) {
      locals.siteSettings = await fetchSiteSettings();
    } else {
      if (buildTimeCache === undefined) {
        buildTimeCache = await fetchSiteSettings();
      }
      locals.siteSettings = buildTimeCache;
    }
  } catch (error) {
    console.error("Failed to fetch site settings:", error instanceof Error ? error.message : "Unknown error");

    locals.siteSettings = null;

    if (isApiRoute) {
      return new Response(JSON.stringify({ success: false, error: "Service temporarily unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (pathname !== "/500" && pathname !== "/500/") {
      return rewrite("/500");
    }

    return new Response("Service temporarily unavailable", { status: 503 });
  }

  const response = await next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=()");

  if (isPreview) {
    response.headers.set("Cache-Control", "no-store");
  }

  return response;
});

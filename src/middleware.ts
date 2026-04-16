import { fetchSiteSettings } from "@/lib/data/fetch-site-settings";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async ({ locals, request, rewrite }, next) => {
  const pathname = new URL(request.url).pathname;
  const isApiRoute = pathname.startsWith("/api/");

  try {
    locals.siteSettings = await fetchSiteSettings();
  } catch (error) {
    console.error("Failed to fetch site settings:", error instanceof Error ? error.message : "Unknown error");

    locals.siteSettings = null;

    // API routes return JSON errors, not HTML rewrites
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
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=()");

  if (import.meta.env.PUBLIC_DEPLOY_MODE === "preview") {
    response.headers.set("Cache-Control", "no-store");
  }

  return response;
});

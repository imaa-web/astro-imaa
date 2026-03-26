import { defineMiddleware } from "astro:middleware";

const CDN_MAX_AGE = 31536000;
const BROWSER_MAX_AGE = 3600;
const STALE_WHILE_REVALIDATE = 86400;

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api/")) {
    return next();
  }

  const cache = (caches as unknown as { default: Cache }).default;

  // Remove query strings da cache key (UTM params etc)
  const cacheUrl = new URL(request.url);
  cacheUrl.search = "";
  const cacheKey = new Request(cacheUrl.toString());

  try {
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
  } catch {
    // Cache lookup failed, proceed to origin
  }

  const originalResponse = await next();

  const contentType = originalResponse.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") || originalResponse.status !== 200) {
    return originalResponse;
  }

  const newHeaders = new Headers(originalResponse.headers);
  newHeaders.set(
    "Cache-Control",
    `public, max-age=${BROWSER_MAX_AGE}, s-maxage=${CDN_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
  );
  newHeaders.set("X-Content-Type-Options", "nosniff");
  newHeaders.set("X-Frame-Options", "DENY");
  newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

  const responseToCache = new Response(originalResponse.body, {
    status: originalResponse.status,
    statusText: originalResponse.statusText,
    headers: newHeaders,
  });

  const cfContext = (locals as Record<string, unknown>).cfContext as
    | { waitUntil: (p: Promise<unknown>) => void }
    | undefined;
  cfContext?.waitUntil(
    cache.put(cacheKey, responseToCache.clone()).catch(() => {
      // Silently ignore cache write failures
    }),
  );

  return responseToCache;
});

import type { APIRoute } from "astro";
import { createHash, timingSafeEqual } from "node:crypto";

const SITE_URL = import.meta.env.SITE ?? "https://www.institutomaestroabiud.org.br";

function safeCompare(a: string, b: string): boolean {
  const aHash = createHash("sha256").update(a).digest();
  const bHash = createHash("sha256").update(b).digest();
  return timingSafeEqual(aHash, bHash);
}

/**
 * Mapeamento extensível: tipo de documento Sanity → URLs a purgar.
 * Para adicionar novos tipos, basta incluir um novo `case`.
 */
function getUrlsToPurge(type: string, slug?: string | null): string[] {
  switch (type) {
    case "homePage":
      return ["/"];

    case "contactPage":
      return ["/contato"];

    case "page":
      return slug ? [`/${slug}`, "/"] : ["/"];

    case "transparencySection":
      return slug ? [`/transparencia/${slug}`, "/transparencia"] : ["/transparencia"];

    case "siteSettings":
      return []; // flag: purge_everything

    default:
      console.warn(`Unknown document type for cache purge: ${type}`);
      return ["/"];
  }
}

export const POST: APIRoute = async ({ request }) => {
  // 1. Validar secret
  const secret = import.meta.env.REVALIDATION_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || !authHeader || !safeCompare(authHeader, `Bearer ${secret}`)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Parsear payload do webhook Sanity
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const docType = body._type as string | undefined;
  const slug = (body.slug as { current?: string } | undefined)?.current ?? null;

  if (!docType) {
    return new Response(JSON.stringify({ error: "Missing _type in payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 3. Obter credenciais Cloudflare
  const cfZoneId = import.meta.env.CF_ZONE_ID;
  const cfApiToken = import.meta.env.CF_API_TOKEN;

  if (!cfZoneId || !cfApiToken) {
    console.error("Revalidation failed: CF_ZONE_ID or CF_API_TOKEN not set");
    return new Response(JSON.stringify({ error: "CF credentials missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 4. Executar purge
  const purgeUrl = `https://api.cloudflare.com/client/v4/zones/${cfZoneId}/purge_cache`;

  let purgeBody: Record<string, unknown>;

  if (docType === "siteSettings") {
    purgeBody = { purge_everything: true };
  } else {
    const paths = getUrlsToPurge(docType, slug);
    const files = paths.map((p) => `${SITE_URL}${p}`);
    purgeBody = { files };
  }

  try {
    const cfResponse = await fetch(purgeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purgeBody),
      signal: AbortSignal.timeout(5000),
    });

    const cfResult = (await cfResponse.json()) as { success: boolean; errors?: unknown[] };

    if (!cfResult.success) {
      console.error("Cloudflare purge failed:", cfResult.errors);
      return new Response(JSON.stringify({ error: "Purge failed", details: cfResult.errors }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const slugInfo = slug ? ` (${slug})` : "";
    console.log(`Cache purge successful for ${docType}${slugInfo}`);
    return new Response(
      JSON.stringify({
        success: true,
        purged: docType === "siteSettings" ? "everything" : purgeBody,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Purge request failed:", error);
    return new Response(JSON.stringify({ error: "Purge request failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};

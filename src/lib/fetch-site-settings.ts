import { loadQuery } from "@/lib/load-query";
import { SITE_SETTINGS_QUERY } from "@/lib/queries/site-settings";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/lib/sanity.types";

export async function fetchSiteSettings(): Promise<SITE_SETTINGS_QUERY_RESULT> {
  const { data } = await loadQuery<SITE_SETTINGS_QUERY_RESULT>({
    query: SITE_SETTINGS_QUERY,
  });

  if (!data) {
    throw new Error("Critical: siteSettings document not found in Sanity.");
  }

  return data;
}

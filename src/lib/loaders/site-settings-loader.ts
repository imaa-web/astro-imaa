import { loadQuery } from "@/lib/load-query";
import { SITE_SETTINGS_QUERY } from "@/lib/queries/site-settings";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/lib/sanity.types";
import type { Loader } from "astro/loaders";

export function siteSettingsLoader(): Loader {
  return {
    name: "site-settings-loader",
    load: async ({ store, logger, parseData, generateDigest }) => {
      logger.info("Fetching Sanity site settings...");

      try {
        const { data: siteSettings } = await loadQuery<SITE_SETTINGS_QUERY_RESULT>({
          query: SITE_SETTINGS_QUERY,
        });

        if (!siteSettings) {
          throw new Error("Critical: siteSettings document not found in Sanity.");
        }

        const parsedData = await parseData({ id: "site-settings", data: siteSettings });
        store.clear();
        store.set({
          id: "site-settings",
          data: parsedData,
          digest: generateDigest(parsedData),
        });

        logger.info("Site settings loaded from Sanity and validated against collection schema.");
      } catch (error) {
        logger.error(`Build failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        throw error;
      }
    },
  };
}

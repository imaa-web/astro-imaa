import { siteSettingsLoader } from "@/lib/loaders/site-settings-loader";
import { siteSettingsSchema } from "@/lib/schemas/site-settings-schema";
import { defineCollection } from "astro:content";

const siteSettingsCollection = defineCollection({
  loader: siteSettingsLoader(),
  schema: siteSettingsSchema,
});

export const collections = {
  siteSettings: siteSettingsCollection,
};

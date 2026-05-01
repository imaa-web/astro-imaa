// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import { loadEnv } from "vite";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

const { PUBLIC_DEPLOY_MODE } = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "PUBLIC_");
const isPreview = PUBLIC_DEPLOY_MODE === "preview";

// https://astro.build/config
export default defineConfig({
  site: "https://www.institutomaestroabiud.org.br",

  ...(isPreview && {
    output: "server",
    adapter: cloudflare({
      imageService: "passthrough",
    }),
  }),

  ...(!isPreview && {
    adapter: cloudflare({
      imageService: "compile",
    }),
  }),

  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  devToolbar: {
    enabled: false,
  },

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
    },
    {
      provider: fontProviders.fontsource(),
      name: "Merriweather",
      cssVariable: "--font-merriweather",
    },
    {
      provider: fontProviders.fontsource(),
      name: "Work Sans",
      cssVariable: "--font-work-sans",
      weights: ["700 900"],
    },
  ],
});

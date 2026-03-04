// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://institutomaestroabiud.org.br",
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare({
    imageService: "compile",
    routes: {
      extend: {
        exclude: [
          { pattern: "/sitemap.xml" },
          { pattern: "/sitemap-index.xml" },
          { pattern: "/*.webp" },
          { pattern: "/*.png" },
          { pattern: "/*.jpg" },
          { pattern: "/*.jpeg" },
          { pattern: "/*.svg" },
          { pattern: "/*.ico" },
          { pattern: "/*.txt" },
          { pattern: "/assets/*" },
        ],
      },
    },
  }),
});

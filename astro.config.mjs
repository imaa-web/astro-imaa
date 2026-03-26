// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://www.institutomaestroabiud.org.br",
  output: "server",
  integrations: [react()],

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },

  adapter: cloudflare({
    imageService: "passthrough",
  }),
  devToolbar: {
    enabled: false,
  },
});

// @ts-check
import { defineConfig } from "astro/config";

// SITE_URL/BASE_PATH permitem publicar em domínio próprio ou em subcaminho do GitHub Pages.
const site = process.env.SITE_URL || "https://matheusfrazatto.github.io";
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "always",
  i18n: {
    locales: ["pt-br", "en"],
    defaultLocale: "pt-br",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    inlineStylesheets: "auto",
  },
  devToolbar: {
    enabled: false,
  },
});

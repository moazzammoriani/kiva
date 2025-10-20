// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  site: "https://moazzammoriani.github.io",
  base: '/kiva'
});

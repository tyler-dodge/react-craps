import { defineConfig } from 'astro/config';

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  build: {
    format: 'file'
  },
  site: 'https://craps.tdodge.consulting',
  integrations: [react(), tailwind({config: {applyBaseStyles: false }}), compress()]
});

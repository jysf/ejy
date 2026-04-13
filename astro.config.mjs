// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ejy0.netlify.app',
  output: 'static',
  integrations: [sitemap()],
});

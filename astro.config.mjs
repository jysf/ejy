// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jysf.github.io',
  base: '/ejy',
  output: 'static',
  integrations: [sitemap()],
});

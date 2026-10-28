import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeFigure from './src/plugins/rehype-figure.mjs';

export default defineConfig({
  site: 'https://namuruiwatani.github.io',
  integrations: [sitemap()],
  markdown: { rehypePlugins: [rehypeFigure] },
});

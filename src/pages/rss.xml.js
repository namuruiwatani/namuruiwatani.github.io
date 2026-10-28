import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort((a, b) => +b.data.date - +a.data.date);
  return rss({
    title: 'Namuru Iwatani',
    description: 'Заметки, размышления и изучения.',
    site: new URL(base, context.site).href,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.description,
      link: `${base}blog/${p.id}/`,
    })),
    customData: '<language>ru</language>',
  });
}

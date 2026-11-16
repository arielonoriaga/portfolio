// /sitemap.xml, generated so new write-ups are listed without hand edits.
import type { APIRoute } from 'astro';
import { site } from '../data/profile';
import { posts } from '../data/writing';

export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${site}/`, lastmod: today },
    { loc: `${site}/cv/`, lastmod: today },
    { loc: `${site}/writing/`, lastmod: posts[0]?.date ?? today },
    ...posts.map((p) => ({ loc: `${site}/writing/${p.slug}/`, lastmod: p.date })),
  ];
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

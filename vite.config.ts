import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { staticRoutes } from './src/config/registry';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** After build: writes per-route index.html with correct SEO tags, plus sitemap.xml and robots.txt. */
function seoPrerender(siteUrl: string): Plugin {
  return {
    name: 'seo-prerender',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve('dist');
      const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
      for (const r of staticRoutes) {
        const tags = [
          siteUrl ? `<link rel="canonical" href="${siteUrl}${r.path}" />` : '',
          `<meta property="og:title" content="${esc(r.title)}" />`,
          `<meta property="og:description" content="${esc(r.description)}" />`,
          `<meta property="og:type" content="website" />`,
          siteUrl ? `<meta property="og:url" content="${siteUrl}${r.path}" />` : '',
          r.jsonLd ? `<script type="application/ld+json">${JSON.stringify(r.jsonLd).replace(/</g, '\\u003c')}</script>` : '',
        ].filter(Boolean).join('\n    ');
        const html = template
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`)
          .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(r.description)}" />`)
          .replace('<!--seo-->', tags);
        const dir = path.join(dist, r.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), html);
      }
      const notFound = template.replace(/<title>[\s\S]*?<\/title>/, '<title>Page not found – DevTools Hub</title>')
        .replace('<!--seo-->', '<meta name="robots" content="noindex" />');
      fs.writeFileSync(path.join(dist, '404.html'), notFound);

      let robots = 'User-agent: *\nAllow: /\n';
      if (siteUrl) {
        const urls = staticRoutes.map((r) => `  <url><loc>${siteUrl}${r.path}</loc></url>`).join('\n');
        fs.writeFileSync(path.join(dist, 'sitemap.xml'),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
        robots += `\nSitemap: ${siteUrl}/sitemap.xml\n`;
      } else {
        console.warn('\n[seo] VITE_SITE_URL is not set: canonical URLs and sitemap.xml were skipped. See .env.example.\n');
      }
      fs.writeFileSync(path.join(dist, 'robots.txt'), robots);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/+$/, '');
  return { plugins: [react(), seoPrerender(siteUrl)] };
});

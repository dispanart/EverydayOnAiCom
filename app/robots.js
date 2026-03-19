// app/robots.js — Auto-generates /robots.txt
import { SITE } from '@/config/site';

export default function robots() {
  return {
    rules: [
      {
        // Allow all crawlers full access
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',          // API routes — not useful to index
          '/dpadmin/',      // Admin panel — must never be indexed
          '/_next/server/', // Next.js server-side internals only
          // NOTE: /_next/static/ is intentionally ALLOWED
          // Google needs JS/CSS bundles to render the page correctly
        ],
      },
      {
        // Explicitly allow major search engine bots
        // (redundant but good practice — confirms they're welcome)
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot'],
        allow: '/',
        disallow: ['/api/', '/dpadmin/'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}

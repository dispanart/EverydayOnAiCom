# Site-wide Search Disabled

This build temporarily removes the site-wide article search to reduce Vercel Fluid Compute usage.

What changed:

- Header search bar removed.
- Mobile search overlay removed.
- `/api/search`, `/api/search/suggest`, and `/api/search-index` removed.
- `/search` redirects to `/articles` and is marked noindex.
- `/search/` is disallowed in robots.txt.
- AI Tools search input removed; category filters remain client-side and do not call API routes.

Re-enable later only after replacing site search with a static client-side index or an external search service such as Algolia/Meilisearch.

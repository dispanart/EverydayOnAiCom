# LocalStorage Search

Search is enabled without Vercel API routes.

How it works:

1. The root layout fetches a lightweight article-title index from WordPress with a 7-day cache.
2. The index is embedded in the HTML as JSON under `#eoa-search-index`.
3. The browser stores that index in `localStorage`.
4. Header suggestions and the `/search` page filter titles locally in the browser.
5. No `/api/search`, `/api/search/suggest`, or `/api/search-index` route is used.

This reduces Vercel Fluid Compute usage because typing in the search bar does not call any API.

Files:

- `components/search/HeaderSearch.jsx`
- `components/search/LocalSearchPage.jsx`
- `components/search/localSearch.js`
- `app/search/page.jsx`
- `app/layout.jsx`
- `lib/wordpress.js`

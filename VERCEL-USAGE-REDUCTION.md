# Vercel Usage Reduction Patch

This build reduces Fluid Compute usage by moving high-frequency features to cached or client-side workflows.

## Changes

- Trending post views are cached for 7 days.
- Displayed article views are cached for 7 days.
- Article view counting is limited to once per article per visitor every 7 days using client localStorage + server cookie.
- Search suggestions no longer call WordPress or `/api/search/suggest` on every keystroke.
- Header search and `/search` use `/api/search-index`, a lightweight title index cached for 7 days.
- Search filtering is performed in the browser after the cached title index loads.
- Main content routes are revalidated less aggressively to reduce repeat server execution.
- `/api/` is already blocked in robots.txt.

## Expected Result

Existing usage percentage in Vercel will not immediately decrease. It should rise much more slowly, and older usage will roll out of the last-30-days window over time.

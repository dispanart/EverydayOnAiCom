# View Counting Daily Refresh

This build sets article view counting and displayed view cache to a 1-day window.

## What changed

- A visitor can be counted once per article every 24 hours.
- The browser-side duplicate guard uses a 24-hour window.
- The server-side cookie `eonai_counted_{postId}` expires after 24 hours.
- Displayed view counts fetched from WordPress are cached for 24 hours.

## Why

This keeps the view count more current than a weekly cache while still reducing Vercel Fluid usage compared with realtime fetching.

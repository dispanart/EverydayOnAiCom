# EverydayOnAI — Headless WordPress + Next.js

A high-performance, SEO-optimized tech media site built with **Next.js 14 (App Router)** connected to a **Headless WordPress** CMS via GraphQL.

---

## Project Structure

```
everydayonai/
│
├── config/
│ └── site.js ← EDIT THIS: category slugs, nav, site settings
│
├── lib/
│ └── wordpress.js ← All GraphQL queries & date helpers
│
├── app/
│ ├── layout.jsx ← Root layout, fonts, metadata
│ ├── globals.css ← Tailwind + article typography styles
│ ├── page.jsx ← Homepage website
│ ├── sitemap.js ← Auto XML sitemap
│ ├── robots.js ← robots.txt
│ ├── not-found.jsx ← Custom 404 pages
│ │
│ ├── [slug]/page.jsx ← Single article page
│ │ (reading progress, share bar, author, updated date)
│ │
│ ├── category/[slug]/ ← Category archive (works for ANY WP category)
│ │
│ ├── search/ ← Search results page
│ ├── about/ ← About Us
│ ├── subscribe/ ← Newsletter subscribe
│ ├── contact/ ← Contact
│ ├── privacy-policy/ ← Privacy Policy
│ ├── terms/ ← Terms of Service
│ ├── disclaimer/ ← Disclaimer
│ │
│ └── api/
│ ├── categories/ ← Serves WP categories to Header dropdown
│ └── revalidate/ ← Webhook: WordPress → Vercel real-time update
│
├── components/
│ ├── layout/
│ │ ├── Header.jsx ← Sticky header with dynamic subcategory dropdown
│ │ └── Footer.jsx ← Dark footer with newsletter form
│ │
│ ├── home/
│ │ ├── HeroSection.jsx ← Featured post hero
│ │ ├── CategorySilo.jsx ← Content section with 4 layout variants
│ │ └── Sidebar.jsx ← Trending posts + ad slot
│ │
│ ├── article/
│ │ ├── ReadingProgressBar.jsx ← Blue progress bar at top
│ │ └── ShareBar.jsx ← WhatsApp, Facebook, X, LinkedIn, Telegram
│ │
│ └── ui/
│ └── index.jsx ← PostCard, RatedCard, MasonryCard, HorizontalCard,
│ DateMeta, CategoryBadge, AdSlot
│
├── next.config.js ← Image optimization, security headers, CSP
├── tailwind.config.js
├── vercel.json
└── .env.local.example
```

---

## Quick Start

### 1. WordPress Setup

Install these plugins on `everydayonai.com`:
- **WPGraphQL** (free) — enables `/graphql` endpoint
- **WP Webhooks** (free) — for real-time revalidation

Verify GraphQL works: visit `https://everydayonai.com/graphql`

Your **current category slugs** (must match exactly in WordPress):
| Category | Slug |
|----------|------|
| AI for Business | `ai-for-business` |
| AI Tools Review & Comparison | `ai-tools-review-comparison` |
| AI for Ideas & Creativity | `ai-for-ideas-creativity` |
| Everyday AI & Lifestyle | `everyday-ai-lifestyle` |

Sub-category (already configured):
| Sub-category | Slug |
|---|---|
| AI Prompts & Guides | *(auto-detected from WordPress)* |

### 2. Deploy to Vercel

```bash
# 1. Push to GitHub
git remote add origin https://github.com/dispanart/EverydayOnAi-WP.git
git push -u origin main

# 2. Import at vercel.com/new
# 3. Set environment variables (see below)
```

**Vercel Environment Variables:**
```
NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL = https://everydayonai.com/graphql
REVALIDATE_SECRET = (run: openssl rand -hex 32)
```

### 3. Custom Domain

In Vercel Dashboard → Project → Settings → Domains → Add your domain.

### 4. Real-time Updates from WordPress

In WordPress → WP Webhooks → Send Data:
- **URL:** `https://YOUR_DOMAIN/api/revalidate`
- **Header:** `x-revalidate-secret: YOUR_REVALIDATE_SECRET`
- **Triggers:** `publish_post`, `post_updated`, `trashed_post`

### 5. Google AdSense

Uncomment the AdSense script in `app/layout.jsx` after approval.
Replace `AdSlot` placeholder content in `components/ui/index.jsx`.

---

## Adding New Categories

1. Create category in WordPress
2. Open `config/site.js`
3. Add to `CATEGORIES` array with correct slug
4. Add to `NAV_LINKS` if it should appear in header

---

## Security Features

- **Content Security Policy (CSP)** — restricts script/style/image sources
- **HSTS** — forces HTTPS for 1 year with preload
- **X-Frame-Options** — prevents clickjacking
- **X-Content-Type-Options** — prevents MIME sniffing
- **Permissions-Policy** — disables unused browser APIs
- **No X-Powered-By** header exposure
- **Environment secrets** never committed to git

---

## Performance Features

- **ISR** — pages revalidate every 60 seconds automatically
- **On-demand revalidation** — webhook triggers instant update on publish
- **Next.js Image** — WebP/AVIF conversion, srcSet, lazy loading, blur placeholder
- **next/font** — self-hosted fonts, zero layout shift
- **Static generation** — all posts/categories pre-rendered at build time
- **Aggressive caching** — static assets cached 1 year, images 1 week

---

## Image Optimization

All WordPress images are automatically:
- Converted to **WebP** (primary) and **AVIF** (fallback)
- Resized to appropriate breakpoints via `srcSet`
- Lazy loaded (except above-the-fold hero)
- Cached for 7 days in browser

No plugins needed — Next.js handles this automatically via `<Image>` component.

---

## Local Development

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your values
npm run dev
```

Visit `http://localhost:3000`


## Featured Image Hero Fix
Hero card now renders the article featured image when available and falls back to a safe AI image if WordPress returns no featured image.

## AdSense setup after approval

The project is AdSense-ready but ads are disabled by default.

1. In Vercel, add these Environment Variables:
   - `NEXT_PUBLIC_ADSENSE_ENABLED=true`
   - `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX`
   - `ADSENSE_PUBLISHER_ID=pub-XXXXXXXXXXXXXXXX`
2. Create ad units in AdSense and copy only the numeric slot IDs.
3. Add slot IDs to Vercel, for example:
   - `NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP=1234567890`
   - `NEXT_PUBLIC_ADSENSE_SLOT_HOME_INFEED=1234567890`
   - `NEXT_PUBLIC_ADSENSE_SLOT_HOME_BOTTOM=1234567890`
   - `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_TOP=1234567890`
   - `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_BOTTOM=1234567890`
   - `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_TOP=1234567890`
   - `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_BOTTOM=1234567890`
   - `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLES_TOP=1234567890`
   - `NEXT_PUBLIC_ADSENSE_SLOT_TOOLS_TOP=1234567890`
4. Redeploy the site from Vercel.

If `NEXT_PUBLIC_ADSENSE_ENABLED` is not `true`, or if a slot ID is empty, no ad block is rendered and no placeholder is shown.


## Real Article Views Counter

This project includes a real-data article views counter for headless WordPress + Next.js.

Important files:

- `app/api/views/[id]/route.js` — Next.js API route for reading and incrementing views.
- `components/article/ArticleViews.jsx` — client component that triggers a view when an article is opened.
- `wordpress-plugin/eonai-view-counter.php` — simple WordPress plugin for the views endpoint.

Environment variables to set in Vercel:

```env
WORDPRESS_REST_URL=https://wp.yourdomain.com
EONAI_VIEW_KEY=replace-with-a-long-random-string
```

`EONAI_VIEW_KEY` must match the `EONAI_VIEW_KEY` value in the WordPress plugin.

The counter uses a 6-hour cookie per article so one reader is not counted repeatedly on every refresh.

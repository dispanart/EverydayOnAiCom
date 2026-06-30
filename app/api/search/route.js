import { NextResponse } from 'next/server';

const WP_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://wp.everydayonai.com/graphql';

const CACHE_TTL = 1000 * 60 * 10;
const MAX_INDEX_POSTS = 500; // raised from 250 — ensures older articles stay searchable
const FETCH_TIMEOUT = 8000;  // raised from 2200ms — cold starts + WP latency need more headroom
const MAX_RETRIES = 2;

globalThis.__eonaiTitleIndexCache ??= {
  items: [],
  fetchedAt: 0,
  fetchingPromise: null, // dedupes concurrent cold-start requests into one fetch
};

function cleanLimit(value, fallback = 12) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(24, Math.round(n)));
}

function sanitizeCategory(category) {
  if (!category) return '';
  return /^[a-z0-9_-]+$/i.test(category) ? category : '';
}

function stripHtml(html = '') {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeEntities(text = '') {
  return String(text)
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&rsquo;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function normalize(text = '') {
  return decodeEntities(stripHtml(text)).toLowerCase();
}

/** Single fetch attempt against WPGraphQL with its own timeout */
async function fetchOnce() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
      body: JSON.stringify({
        query: `query EonaiFastSearchIndex($first: Int!) {
          posts(first: $first, where: { orderby: { field: MODIFIED, order: DESC } }) {
            nodes {
              id
              databaseId
              title
              slug
              date
              modifiedGmt
              excerpt
              featuredImage { node { sourceUrl altText } }
              categories { nodes { name slug } }
            }
          }
        }`,
        variables: { first: MAX_INDEX_POSTS },
      }),
    });

    if (!res.ok) throw new Error(`WPGraphQL responded ${res.status}`);
    const json = await res.json();
    const items = json.data?.posts?.nodes ?? [];

    return items
      .filter((post) => post?.title && post?.slug)
      .map((post) => ({
        ...post,
        title: decodeEntities(stripHtml(post.title)),
        excerpt: decodeEntities(stripHtml(post.excerpt || '')),
        _title: normalize(post.title),
        _excerpt: normalize(post.excerpt || ''),
        _categorySlugs: (post.categories?.nodes || []).map((cat) => cat.slug),
      }));
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fetch the full index with retry on failure, and de-dupe concurrent
 * requests during cold start so multiple simultaneous searches don't
 * all hit WPGraphQL at once.
 */
async function fetchSearchIndex() {
  if (globalThis.__eonaiTitleIndexCache.fetchingPromise) {
    return globalThis.__eonaiTitleIndexCache.fetchingPromise;
  }

  const promise = (async () => {
    let lastError = null;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const mapped = await fetchOnce();
        globalThis.__eonaiTitleIndexCache = {
          items: mapped,
          fetchedAt: Date.now(),
          fetchingPromise: null,
        };
        return mapped;
      } catch (err) {
        lastError = err;
        if (attempt < MAX_RETRIES) await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      }
    }
    console.error('[search] fetchSearchIndex failed after retries:', lastError?.message);
    globalThis.__eonaiTitleIndexCache.fetchingPromise = null;
    return null;
  })();

  globalThis.__eonaiTitleIndexCache.fetchingPromise = promise;
  return promise;
}

function score(post, query) {
  const title = post._title || '';
  const excerpt = post._excerpt || '';
  if (title === query) return 100;
  if (title.startsWith(query)) return 90;
  if (title.includes(query)) return 75;
  const tokens = query.split(/\s+/).filter(Boolean);
  const titleHits = tokens.filter((token) => title.includes(token)).length;
  const excerptHits = tokens.filter((token) => excerpt.includes(token)).length;
  return titleHits * 18 + excerptHits * 3;
}

function sortResults(results, sort) {
  if (sort === 'date_asc') {
    return results.sort((a, b) => new Date(a.post.modifiedGmt || a.post.date) - new Date(b.post.modifiedGmt || b.post.date));
  }
  if (sort === 'date_desc') {
    return results.sort((a, b) => new Date(b.post.modifiedGmt || b.post.date) - new Date(a.post.modifiedGmt || a.post.date));
  }
  return results.sort((a, b) => b.points - a.points || new Date(b.post.modifiedGmt || b.post.date) - new Date(a.post.modifiedGmt || a.post.date));
}

function searchIndex(items, { q, category, sort, limit }) {
  const query = normalize(q);
  if (!query || query.length < 2) return [];

  const scored = items
    .filter((post) => !category || post._categorySlugs?.includes(category))
    .map((post) => ({ post, points: score(post, query) }))
    .filter((entry) => entry.points > 0);

  return sortResults(scored, sort)
    .slice(0, limit)
    .map(({ post }) => ({
      id: post.id,
      databaseId: post.databaseId,
      title: post.title,
      slug: post.slug,
      date: post.date,
      modifiedGmt: post.modifiedGmt,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      categories: post.categories,
    }));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const category = sanitizeCategory(searchParams.get('category') || '');
  const sort = searchParams.get('sort') || 'relevance';
  const limit = cleanLimit(searchParams.get('limit'), 12);

  if (q.length < 2) return NextResponse.json({ results: [] });

  const cache = globalThis.__eonaiTitleIndexCache;
  const fresh = cache.items.length > 0 && Date.now() - cache.fetchedAt < CACHE_TTL;

  let items = cache.items;
  if (!fresh) {
    const fetched = await fetchSearchIndex();
    // Fall back to stale cache rather than nothing if a refetch fails —
    // stale results beat a "warming up" error for the user.
    items = fetched || cache.items;
  }

  if (!items.length) {
    return NextResponse.json(
      { results: [], error: 'Search is temporarily unavailable. Please try again in a moment.' },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { results: searchIndex(items, { q, category, sort, limit }) },
    { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=300' } }
  );
}

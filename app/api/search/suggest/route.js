import { NextResponse } from 'next/server';

const WP_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://wp.everydayonai.com/graphql';

const CACHE_TTL = 1000 * 60 * 10;
const MAX_INDEX_POSTS = 500;
const FETCH_TIMEOUT = 6000; // raised from 1800ms
const MAX_RETRIES = 1;       // suggest endpoint stays snappier — 1 retry only

globalThis.__eonaiTitleIndexCache ??= {
  items: [],
  fetchedAt: 0,
  fetchingPromise: null,
};

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
        query: `query EonaiFastTitleIndex($first: Int!) {
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
      }));
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchTitleIndex() {
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
        if (attempt < MAX_RETRIES) await new Promise((r) => setTimeout(r, 300));
      }
    }
    console.error('[search/suggest] fetchTitleIndex failed:', lastError?.message);
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

function searchIndex(items, q, limit) {
  const query = normalize(q);
  if (!query || query.length < 2) return [];

  return items
    .map((post) => ({ post, points: score(post, query) }))
    .filter((entry) => entry.points > 0)
    .sort((a, b) => b.points - a.points || new Date(b.post.modifiedGmt || b.post.date) - new Date(a.post.modifiedGmt || a.post.date))
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
  const limit = Math.max(1, Math.min(10, Number(searchParams.get('limit')) || 6));

  if (q.length < 2) return NextResponse.json({ results: [] });

  const cache = globalThis.__eonaiTitleIndexCache;
  const fresh = cache.items.length > 0 && Date.now() - cache.fetchedAt < CACHE_TTL;

  let items = cache.items;
  if (!fresh) {
    const fetched = await fetchTitleIndex();
    items = fetched || cache.items;
  }

  return NextResponse.json(
    { results: searchIndex(items, q, limit) },
    { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=300' } }
  );
}

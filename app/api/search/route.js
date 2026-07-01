import { NextResponse } from 'next/server';

const WP_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://wp.everydayonai.com/graphql';

function sanitizeCategory(category) {
  if (!category) return '';
  return /^[a-z0-9_-]+$/i.test(category) ? category : '';
}

function cleanLimit(value, fallback = 12) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(20, Math.round(n)));
}

function getOrderBy(sort) {
  if (sort === 'date_asc') return '{ field: DATE, order: ASC }';
  if (sort === 'date_desc') return '{ field: MODIFIED, order: DESC }';
  return '{ field: MODIFIED, order: DESC }';
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const category = sanitizeCategory(searchParams.get('category') || '');
  const sort = searchParams.get('sort') || 'relevance';
  const limit = cleanLimit(searchParams.get('limit'), 12);

  if (!q) return NextResponse.json({ results: [] });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5500);
  const orderby = getOrderBy(sort);
  const categoryFilter = category ? `categoryName: "${category}",` : '';

  try {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
      body: JSON.stringify({
        query: `query Search($search: String!, $first: Int!) {
          posts(first: $first, where: { search: $search, ${categoryFilter} orderby: ${orderby} }) {
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
        variables: { search: q, first: limit },
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { results: [], error: 'Search service is temporarily unavailable.' },
        { status: 200 }
      );
    }

    const json = await res.json();
    const results = json.data?.posts?.nodes ?? [];
    return NextResponse.json(
      { results },
      { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=300' } }
    );
  } catch (error) {
    const timedOut = error?.name === 'AbortError';
    return NextResponse.json(
      {
        results: [],
        error: timedOut
          ? 'Search is taking longer than expected. Please try a more specific keyword.'
          : 'Search is temporarily unavailable.',
      },
      { status: 200 }
    );
  } finally {
    clearTimeout(timeout);
  }
}

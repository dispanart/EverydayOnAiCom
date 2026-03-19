/**
 * GET /api/posts?category=slug&first=12&after=cursor
 * Returns paginated posts for Load More functionality
 */

import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const first    = parseInt(searchParams.get('first') || '12');
  const after    = searchParams.get('after') || null;

  if (!category) return NextResponse.json({ posts: [] });

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query CategoryPosts($slug: String!, $first: Int!) {
            posts(first: $first, where: {
              categoryName: $slug,
              orderby: { field: MODIFIED, order: DESC }
            }) {
              nodes {
                id title slug date modifiedGmt excerpt
                featuredImage { node { sourceUrl altText } }
              }
            }
          }
        `,
        variables: { slug: category, first: first * 2 }, // fetch extra to simulate pagination
      }),
    });

    const json  = await res.json();
    const all   = json.data?.posts?.nodes ?? [];

    // Simple cursor-based pagination using ID
    let startIdx = 0;
    if (after) {
      const idx = all.findIndex((p) => p.id === after);
      if (idx !== -1) startIdx = idx + 1;
    }

    const posts = all.slice(startIdx, startIdx + first);
    return NextResponse.json({ posts });
  } catch (err) {
    console.error('[Posts API]', err.message);
    return NextResponse.json({ posts: [] });
  }
}

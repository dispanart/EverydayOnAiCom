import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q        = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort     = searchParams.get('sort') || 'relevance';
  if (!q.trim()) return NextResponse.json({ results: [] });

  const orderby = sort === 'date_asc' ? '{ field: DATE, order: ASC }' : '{ field: MODIFIED, order: DESC }';

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query Search($search: String!) {
          posts(first: 20, where: { search: $search, ${category ? `categoryName: "${category}",` : ''} orderby: ${orderby} }) {
            nodes { id title slug date modifiedGmt excerpt
              featuredImage { node { sourceUrl altText } }
              categories { nodes { name slug } } }
          }
        }`,
        variables: { search: q },
      }),
    });
    const json = await res.json();
    return NextResponse.json({ results: json.data?.posts?.nodes ?? [] });
  } catch { return NextResponse.json({ results: [] }); }
}

import { NextResponse } from 'next/server';

const WP_GRAPHQL_URL =
 process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://wp.everydayonai.com/graphql';

const REVALIDATE_SECONDS = 60 * 60 * 24 * 7;

export const revalidate = REVALIDATE_SECONDS;

export async function GET() {
 try {
 const res = await fetch(WP_GRAPHQL_URL, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 next: { revalidate: REVALIDATE_SECONDS },
 body: JSON.stringify({
 query: `query SearchIndex {
 posts(first: 500, where: { orderby: { field: MODIFIED, order: DESC } }) {
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
 }),
 });

 if (!res.ok) {
 return NextResponse.json(
 { posts: [], error: 'Search index is temporarily unavailable.' },
 { status: 200, headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
 );
 }

 const json = await res.json();
 const posts = json.data?.posts?.nodes ?? [];

 return NextResponse.json(
 { posts, generatedAt: new Date().toISOString() },
 {
 headers: {
 'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS}`,
 },
 }
 );
 } catch {
 return NextResponse.json(
 { posts: [], error: 'Search index is temporarily unavailable.' },
 { status: 200, headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
 );
 }
}

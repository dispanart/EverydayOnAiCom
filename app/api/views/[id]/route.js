import { proxyToWordPress } from '../../_eonai';

export const runtime = 'nodejs';
export const revalidate = 604800;

function invalidPostId() {
 return Response.json({ ok: false, message: 'Valid post id is required.', views: 0 }, { status: 400 });
}

export async function GET(request, { params }) {
 const postId = Number(params.id || 0);
 if (!postId) return invalidPostId();

 const wpBase = process.env.WORDPRESS_REST_URL || process.env.WORDPRESS_API_URL;
 const secret = process.env.EONAI_ENGAGEMENT_KEY;

 if (!wpBase || !secret) {
 return Response.json(
 { ok: false, message: 'WORDPRESS_REST_URL and EONAI_ENGAGEMENT_KEY must be configured.', views: 0 },
 { status: 500 }
 );
 }

 try {
 const res = await fetch(`${wpBase.replace(/\/$/, '')}/wp-json/eonai/v1/post-engagement/${postId}`, {
 method: 'GET',
 headers: {
 'x-eonai-engagement-key': secret,
 },
 next: { revalidate: 604800 },
 });
 const data = await res.json().catch(() => ({ ok: false, views: 0 }));

 return Response.json(data, {
 status: res.ok ? 200 : 200,
 headers: {
 'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=604800',
 },
 });
 } catch {
 return Response.json(
 { ok: false, message: 'Views are temporarily unavailable.', views: 0 },
 { status: 200, headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
 );
 }
}

export async function POST(request, { params }) {
 const postId = Number(params.id || 0);
 if (!postId) return invalidPostId();

 return proxyToWordPress(request, {
 path: `/view/${postId}`,
 body: {},
 });
}

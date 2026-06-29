import { proxyToWordPress } from '../../_eonai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function invalidPostId() {
 return Response.json({ ok: false, message: 'Valid post id is required.', views: 0 }, { status: 400 });
}

export async function GET(request, { params }) {
 const postId = Number(params.id || 0);
 if (!postId) return invalidPostId();

 return proxyToWordPress(request, {
 path: `/post-engagement/${postId}`,
 method: 'GET',
 });
}

export async function POST(request, { params }) {
 const postId = Number(params.id || 0);
 if (!postId) return invalidPostId();

 return proxyToWordPress(request, {
 path: `/view/${postId}`,
 body: {},
 });
}

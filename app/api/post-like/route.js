import { proxyToWordPress, readJson } from '../_eonai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
 const body = await readJson(request);
 const postId = Number(body.post_id || body.postId || 0);

 if (!postId) {
 return Response.json({ ok: false, message: 'post_id is required.' }, { status: 400 });
 }

 return proxyToWordPress(request, {
 path: `/post-like/${postId}`,
 body: {},
 });
}

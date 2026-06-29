import { proxyToWordPress, readJson } from '../_eonai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
 const body = await readJson(request);
 const commentId = Number(body.comment_id || body.commentId || 0);

 if (!commentId) {
 return Response.json({ ok: false, message: 'comment_id is required.' }, { status: 400 });
 }

 return proxyToWordPress(request, {
 path: `/comment-like/${commentId}`,
 body: {},
 });
}

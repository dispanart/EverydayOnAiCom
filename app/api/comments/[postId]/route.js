import { proxyToWordPress, readJson } from '../../_eonai';
import { auth } from '../../../../auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
 const postId = Number(params.postId || 0);
 const url = new URL(request.url);
 const perPage = url.searchParams.get('per_page') || '50';

 if (!postId) {
 return Response.json({ ok: false, message: 'postId is required.' }, { status: 400 });
 }

 return proxyToWordPress(request, {
 path: `/comments/${postId}`,
 method: 'GET',
 query: `?per_page=${encodeURIComponent(perPage)}`,
 });
}

export async function POST(request, { params }) {
 const postId = Number(params.postId || 0);
 const body = await readJson(request);
 const session = await auth();

 if (!postId) {
 return Response.json({ ok: false, message: 'postId is required.' }, { status: 400 });
 }

 if (!session?.user?.email || session.user.emailVerified !== true) {
 return Response.json(
 { ok: false, message: 'Login with a verified Google account before commenting.' },
 { status: 401 }
 );
 }

 return proxyToWordPress(request, {
 path: `/comment/${postId}`,
 body: {
 google_name: session.user.name || session.user.email,
 google_email: session.user.email,
 google_picture: session.user.image || '',
 google_email_verified: true,
 content: body.content || '',
 parent_id: body.parent_id || 0,
 },
 });
}

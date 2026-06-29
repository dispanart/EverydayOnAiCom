import { proxyToWordPress, readJson } from '../_eonai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
 const body = await readJson(request);
 const email = String(body.email || '').trim();

 if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
 return Response.json({ ok: false, error: 'Invalid email address.' }, { status: 400 });
 }

 return proxyToWordPress(request, {
 path: '/newsletter',
 timeoutMs: 6000,
 body: {
 email,
 name: body.name || '',
 consent: true,
 source: body.source || 'subscribe-page',
 post_id: body.post_id || 0,
 },
 });
}

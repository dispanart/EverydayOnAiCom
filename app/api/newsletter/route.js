import { proxyToWordPress, readJson } from '../_eonai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
 const body = await readJson(request);

 return proxyToWordPress(request, {
 path: '/newsletter',
 body: {
 email: body.email,
 name: body.name || '',
 consent: Boolean(body.consent),
 source: body.source || 'website',
 post_id: body.post_id || 0,
 },
 });
}

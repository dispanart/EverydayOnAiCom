import { NextResponse } from 'next/server';
import crypto from 'crypto';

const VISITOR_COOKIE = 'eonai_vid';

function cleanWordPressMessage(value) {
 if (!value || typeof value !== 'string') return '';

 const text = value
 .replace(/<[^>]*>/g, ' ')
 .replace(/\s+/g, ' ')
 .trim();

 if (text.toLowerCase().includes('critical error on this website')) {
 return 'WordPress returned a server error. Check the EONAI Engagement plugin and WordPress error log.';
 }

 return text;
}

export async function proxyToWordPress(request, { path, method = 'POST', body = null, query = '', timeoutMs = 8000 }) {
 const wpBase = process.env.WORDPRESS_REST_URL || process.env.WORDPRESS_API_URL;
 const secret = process.env.EONAI_ENGAGEMENT_KEY;

 if (!wpBase || !secret) {
 return NextResponse.json(
 { ok: false, message: 'WORDPRESS_REST_URL and EONAI_ENGAGEMENT_KEY must be configured.' },
 { status: 500 }
 );
 }

 const existingVisitorId = request.cookies.get(VISITOR_COOKIE)?.value;
 const visitorId = existingVisitorId || crypto.randomUUID();
 const forwardedFor = request.headers.get('x-forwarded-for') || '';
 const clientIp = forwardedFor.split(',')[0]?.trim() || '';
 const cleanBase = wpBase.replace(/\/$/, '');
 const url = `${cleanBase}/wp-json/eonai/v1${path}${query}`;

 let wpResponse;
 try {
 wpResponse = await fetch(url, {
 method,
 headers: {
 'content-type': 'application/json',
 'x-eonai-engagement-key': secret,
 'x-eonai-visitor-id': visitorId,
 'x-eonai-client-ip': clientIp,
 },
 body: body ? JSON.stringify(body) : undefined,
 cache: 'no-store',
 signal: AbortSignal.timeout(timeoutMs),
 });
 } catch (error) {
 if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
 return NextResponse.json(
 { ok: false, message: 'WordPress took too long to respond. Please try again.' },
 { status: 504 }
 );
 }
 return NextResponse.json(
 { ok: false, message: 'Could not connect to WordPress. Please try again.' },
 { status: 502 }
 );
 }

 const data = await wpResponse.json().catch(() => ({
 ok: false,
 message: 'WordPress returned an invalid response.',
 }));

 if (data?.message) {
 data.message = cleanWordPressMessage(data.message);
 }

 const response = NextResponse.json(data, { status: wpResponse.status });

 if (!existingVisitorId) {
 response.cookies.set(VISITOR_COOKIE, visitorId, {
 httpOnly: true,
 sameSite: 'lax',
 secure: process.env.NODE_ENV === 'production',
 path: '/',
 maxAge: 60 * 60 * 24 * 365,
 });
 }

 return response;
}

export async function readJson(request) {
 return request.json().catch(() => ({}));
}

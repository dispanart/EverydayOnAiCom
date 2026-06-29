import { NextResponse } from 'next/server';
import crypto from 'crypto';

const VISITOR_COOKIE = 'eonai_vid';

export async function proxyToWordPress(request, { path, method = 'POST', body = null, query = '' }) {
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

 const wpResponse = await fetch(url, {
 method,
 headers: {
 'content-type': 'application/json',
 'x-eonai-engagement-key': secret,
 'x-eonai-visitor-id': visitorId,
 'x-eonai-client-ip': clientIp,
 },
 body: body ? JSON.stringify(body) : undefined,
 cache: 'no-store',
 });

 const data = await wpResponse.json().catch(() => ({
 ok: false,
 message: 'Invalid WordPress response.',
 }));

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

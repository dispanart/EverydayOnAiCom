import { NextResponse } from 'next/server';
import { proxyToWordPress } from '../../_eonai';

export const runtime = 'nodejs';

const DAY_SECONDS = 60 * 60 * 24;

function invalidPostId() {
  return NextResponse.json({ ok: false, message: 'Valid post id is required.', views: 0 }, { status: 400 });
}

async function fetchEngagement(postId) {
  const wpBase = process.env.WORDPRESS_REST_URL || process.env.WORDPRESS_API_URL;
  if (!wpBase) return { ok: false, views: 0, likes: 0 };

  const url = `${wpBase.replace(/\/$/, '')}/wp-json/eonai/v1/post-engagement/${postId}`;
  const res = await fetch(url, { next: { revalidate: DAY_SECONDS } });
  if (!res.ok) return { ok: false, views: 0, likes: 0 };
  return res.json().catch(() => ({ ok: false, views: 0, likes: 0 }));
}

export async function GET(request, { params }) {
  const postId = Number(params.id || 0);
  if (!postId) return invalidPostId();

  const data = await fetchEngagement(postId);
  return NextResponse.json(data, {
    headers: { 'Cache-Control': `public, s-maxage=${DAY_SECONDS}, stale-while-revalidate=${DAY_SECONDS}` },
  });
}

export async function POST(request, { params }) {
  const postId = Number(params.id || 0);
  if (!postId) return invalidPostId();

  const cookieName = `eonai_counted_${postId}`;
  if (request.cookies.get(cookieName)?.value) {
    const data = await fetchEngagement(postId);
    return NextResponse.json({ ...data, counted: false }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  }

  const response = await proxyToWordPress(request, {
    path: `/view/${postId}`,
    body: {},
    timeoutMs: 5000,
  });

  response.cookies.set(cookieName, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DAY_SECONDS,
  });

  return response;
}

/**
 * ─────────────────────────────────────────────────────────────────
 *  POST /api/revalidate
 *
 *  WordPress webhook — triggers ISR revalidation when a post is
 *  published, updated, or trashed.
 *
 *  Setup (WordPress side):
 *    1. Install "WP Webhooks" plugin (free)
 *    2. Add webhook URL: https://YOUR_DOMAIN/api/revalidate
 *    3. Add header: x-revalidate-secret = <your REVALIDATE_SECRET>
 *    4. Trigger on: publish_post, post_updated, trashed_post
 *
 *  Vercel env var required:
 *    REVALIDATE_SECRET = a strong random string (e.g. openssl rand -hex 32)
 * ─────────────────────────────────────────────────────────────────
 */

import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  // ── Verify secret ─────────────────────────────────────────────
  const secret = request.headers.get('x-revalidate-secret');

  if (!process.env.REVALIDATE_SECRET) {
    console.error('[Revalidate] REVALIDATE_SECRET env var not set.');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse payload ─────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { slug, post_type } = body;

  // Only process standard posts
  if (post_type && post_type !== 'post') {
    return NextResponse.json({ message: `Skipped post_type: ${post_type}` });
  }

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid slug' }, { status: 400 });
  }

  // ── Revalidate affected pages ─────────────────────────────────
  try {
    await Promise.all([
      revalidatePath('/'),                       // Homepage
      revalidatePath(`/${slug}`),                // Single post
      revalidatePath('/category/[slug]', 'page'), // All category archives
      revalidatePath('/search', 'page'),          // Search results
    ]);

    console.log(`[Revalidate] ✓ Revalidated /${slug} at ${new Date().toISOString()}`);

    return NextResponse.json({
      revalidated: true,
      slug,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Revalidate] Error:', err.message);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}

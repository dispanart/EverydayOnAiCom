/**
 * GET  /api/comments?slug=xxx  → get approved comments
 * POST /api/comments           → submit new comment (pending approval)
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

function hashIP(ip) {
  return createHash('sha256').update(ip + (process.env.IP_SALT || 'eai-salt')).digest('hex').slice(0, 32);
}

function getIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

// Sanitize input — strip HTML tags
function sanitize(str) {
  return str?.replace(/<[^>]*>/g, '').trim() ?? '';
}

// GET — fetch approved comments for a slug
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const { data, error } = await supabase
    .from('comments')
    .select('id, name, content, created_at')
    .eq('slug', slug)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });

  return NextResponse.json({ comments: data ?? [] });
}

// POST — submit new comment
export async function POST(request) {
  try {
    const body = await request.json();
    const name    = sanitize(body.name);
    const email   = sanitize(body.email);
    const content = sanitize(body.content);
    const slug    = sanitize(body.slug);

    // Validation
    if (!slug)                            return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    if (!name || name.length < 2)         return NextResponse.json({ error: 'Nama minimal 2 karakter' }, { status: 400 });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Email tidak valid' }, { status: 400 });
    if (!content || content.length < 5)   return NextResponse.json({ error: 'Comment must be at least 5 characters' }, { status: 400 });
    if (content.length > 1000)            return NextResponse.json({ error: 'Comment must be under 1000 characters' }, { status: 400 });

    // Spam check — max 3 comments per IP per day
    const ipHash = hashIP(getIP(request));
    const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
    const { count } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', oneDayAgo);

    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: 'Terlalu banyak komentar. Coba lagi besok.' }, { status: 429 });
    }

    const { error } = await supabase.from('comments').insert({
      slug, name, email, content, ip_hash: ipHash, approved: false,
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Comment submitted! Awaiting moderator approval.',
    });
  } catch (err) {
    console.error('[Comments] Error:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * GET  /api/likes?slug=xxx  → get like count + whether current IP liked
 * POST /api/likes           → toggle like (like/unlike)
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

// Hash IP for privacy — we never store raw IPs
function hashIP(ip) {
  return createHash('sha256').update(ip + process.env.IP_SALT || 'eai-salt').digest('hex').slice(0, 32);
}

function getIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

// GET — fetch like count + liked status for current IP
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const ipHash = hashIP(getIP(request));

  const [{ count }, { data: userLike }] = await Promise.all([
    supabase.from('likes').select('*', { count: 'exact', head: true }).eq('slug', slug),
    supabase.from('likes').select('id').eq('slug', slug).eq('ip_hash', ipHash).maybeSingle(),
  ]);

  return NextResponse.json({ count: count ?? 0, liked: !!userLike });
}

// POST — toggle like
export async function POST(request) {
  const { slug } = await request.json();
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const ipHash = hashIP(getIP(request));

  // Check if already liked
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('slug', slug)
    .eq('ip_hash', ipHash)
    .maybeSingle();

  if (existing) {
    // Unlike
    await supabase.from('likes').delete().eq('id', existing.id);
  } else {
    // Like
    await supabase.from('likes').insert({ slug, ip_hash: ipHash });
  }

  // Get updated count
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('slug', slug);

  return NextResponse.json({ count: count ?? 0, liked: !existing });
}

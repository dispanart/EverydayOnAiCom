/**
 * GET    /api/bookmarks?session=xxx          → get all bookmarks for session
 * POST   /api/bookmarks                      → add bookmark
 * DELETE /api/bookmarks?session=xxx&slug=xxx → remove bookmark
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET — fetch all bookmarks for a session
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const session = searchParams.get('session');
  if (!session) return NextResponse.json({ bookmarks: [] });

  const { data } = await supabase
    .from('bookmarks')
    .select('slug, title, created_at')
    .eq('session_id', session)
    .order('created_at', { ascending: false });

  return NextResponse.json({ bookmarks: data ?? [] });
}

// POST — add bookmark
export async function POST(request) {
  const { session, slug, title } = await request.json();
  if (!session || !slug) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  const { error } = await supabase
    .from('bookmarks')
    .upsert({ session_id: session, slug, title }, { onConflict: 'session_id,slug' });

  if (error) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE — remove bookmark
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const session = searchParams.get('session');
  const slug    = searchParams.get('slug');
  if (!session || !slug) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  await supabase.from('bookmarks').delete().eq('session_id', session).eq('slug', slug);
  return NextResponse.json({ success: true });
}

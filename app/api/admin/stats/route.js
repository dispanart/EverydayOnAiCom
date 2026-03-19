import { NextResponse } from 'next/server';
import { verifyAdminToken, COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const token = cookies().get(COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [likes, allComments, pending, pushSubs] = await Promise.all([
    supabase.from('likes').select('*', { count: 'exact', head: true }),
    supabase.from('comments').select('*', { count: 'exact', head: true }),
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('approved', false),
    supabase.from('push_subscriptions').select('*', { count: 'exact', head: true }),
  ]);

  return NextResponse.json({
    totalLikes:      likes.count      ?? 0,
    totalComments:   allComments.count ?? 0,
    pendingComments: pending.count    ?? 0,
    pushSubscribers: pushSubs.count   ?? 0,
  });
}

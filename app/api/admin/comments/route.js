import { NextResponse } from 'next/server';
import { verifyAdminToken, COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const token = cookies().get(COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [approvedRes, pendingRes] = await Promise.all([
    supabase.from('comments').select('id,slug,name,email,content,created_at').eq('approved', true).order('created_at', { ascending: false }).limit(50),
    supabase.from('comments').select('id,slug,name,email,content,created_at').eq('approved', false).order('created_at', { ascending: false }),
  ]);

  return NextResponse.json({ approved: approvedRes.data ?? [], pending: pendingRes.data ?? [] });
}

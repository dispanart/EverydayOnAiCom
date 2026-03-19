import { NextResponse } from 'next/server';
import { verifyAdminToken, COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function POST(req, { params }) {
  const token = cookies().get(COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await supabase.from('comments').update({ approved: true }).eq('id', params.id);
  return NextResponse.json({ ok: true });
}

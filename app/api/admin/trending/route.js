import { NextResponse } from 'next/server';
import { verifyAdminToken, COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const token = cookies().get(COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabase.from('likes').select('slug');
  if (!data) return NextResponse.json({ trending: [] });

  const counts = {};
  data.forEach(({ slug }) => { counts[slug] = (counts[slug] || 0) + 1; });
  const trending = Object.entries(counts)
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return NextResponse.json({ trending });
}

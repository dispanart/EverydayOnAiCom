import { NextResponse } from 'next/server';
import { verifyAdminToken, COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';
export async function GET() {
  const token = cookies().get(COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ ok: true });
}

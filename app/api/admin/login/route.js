import { NextResponse } from 'next/server';
import { signAdminToken, COOKIE } from '@/lib/auth';
export async function POST(req) {
  const { username, password } = await req.json();
  const ok = username === (process.env.ADMIN_USERNAME)
          && password === (process.env.ADMIN_PASSWORD);
  if (!ok) return NextResponse.json({ error: 'Invalid' }, { status: 401 });
  const token = await signAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 28800, path: '/' });
  return res;
}

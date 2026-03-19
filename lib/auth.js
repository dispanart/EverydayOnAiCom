/**
 * lib/auth.js — Admin auth helpers using jose JWT
 */
import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET
);
const COOKIE = 'eai_admin_token';
const EXPIRES = 60 * 60 * 8; // 8 hours

export async function signAdminToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRES}s`)
    .sign(SECRET);
}

export async function verifyAdminToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.role === 'admin';
  } catch { return false; }
}

export { COOKIE };

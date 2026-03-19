import { NextResponse } from 'next/server';
import { verifyAdminToken, COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req) {
  const token = cookies().get(COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, body, url } = await req.json();

  // Import and configure web-push INSIDE the handler (avoids build-time crash)
  const webpush = (await import('web-push')).default;
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:admin@everydayonai.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    process.env.VAPID_PRIVATE_KEY || ''
  );

  const { data: subs } = await supabase.from('push_subscriptions').select('*');
  if (!subs?.length) return NextResponse.json({ message: 'No subscribers found.' });

  const payload = JSON.stringify({
    title,
    body,
    url: url || 'https://everydayonai.com',
    icon: '/icon-192.png',
  });

  let sent = 0, failed = 0;
  await Promise.allSettled(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        );
        sent++;
      } catch (e) {
        failed++;
        if (e.statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', s.endpoint);
        }
      }
    })
  );

  return NextResponse.json({ message: `Sent to ${sent} subscribers. Failed: ${failed}.` });
}

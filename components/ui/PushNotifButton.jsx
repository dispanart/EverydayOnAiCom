'use client';
import { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

export default function PushNotifButton() {
  const [status, setStatus] = useState('idle'); // idle | loading | subscribed | unsupported
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported'); return;
    }
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        setStatus(sub ? 'subscribed' : 'idle');
      });
    });
  }, []);

  async function toggle() {
    if (status === 'loading' || status === 'unsupported') return;
    setStatus('loading');

    try {
      const reg = await navigator.serviceWorker.ready;

      if (status === 'subscribed') {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await fetch('/api/push/subscribe', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          });
          await sub.unsubscribe();
        }
        setStatus('idle');
      } else {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') { setStatus('idle'); return; }

        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
        });
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub),
        });
        setStatus('subscribed');
      }
    } catch (e) {
      console.error('[Push]', e);
      setStatus('idle');
    }
  }

  if (!mounted || status === 'unsupported') return null;

  return (
    <button onClick={toggle} disabled={status === 'loading'}
      title={status === 'subscribed' ? 'Matikan notifikasi' : 'Aktifkan notifikasi artikel baru'}
      className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold border-2 transition-all
        ${status === 'subscribed'
          ? 'border-green-400 text-green-600 bg-green-50 hover:bg-green-100'
          : 'border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'}`}>
      {status === 'loading' ? <Loader2 size={13} className="animate-spin" />
       : status === 'subscribed' ? <Bell size={13} className="fill-green-500" />
       : <BellOff size={13} />}
      {status === 'subscribed' ? 'Notif Aktif' : 'Aktifkan Notif'}
    </button>
  );
}

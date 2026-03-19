/**
 * GoogleAdSenseScript.jsx
 * Sudah otomatis dimuat dari app/layout.jsx
 *
 * Cara aktifkan:
 * 1. Set env var di Vercel: NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
 * 2. Komponen ini akan otomatis aktif begitu env var diset
 */

import Script from 'next/script';

export default function GoogleAdSenseScript() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) return null;

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

import Script from 'next/script';

export default function GoogleAdSenseScript() {
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== 'false';
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-2629543840580780';

  if (!enabled || !client) return null;

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

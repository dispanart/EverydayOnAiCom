'use client';

import { useEffect, useRef } from 'react';

export const AD_SLOTS = {
  leaderboard:     'XXXXXXXXXX',
  'in-feed':       'XXXXXXXXXX',
  rectangle:       'XXXXXXXXXX',
  'leaderboard-2': 'XXXXXXXXXX',
  sidebar:         'XXXXXXXXXX',
};

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AdSense({ slot = 'leaderboard', format = 'auto', style = {} }) {
  const adRef  = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || !AD_SLOTS[slot] || AD_SLOTS[slot] === 'XXXXXXXXXX') return;
    if (pushed.current) return;
    try { pushed.current = true; (window.adsbygoogle = window.adsbygoogle || []).push({}); }
    catch (e) { console.error('[AdSense]', e); }
  }, [slot]);

  // Placeholder — shown until AdSense is configured
  if (!CLIENT || AD_SLOTS[slot] === 'XXXXXXXXXX') {
    const heights = { leaderboard: 90, 'in-feed': 150, rectangle: 250, 'leaderboard-2': 90, sidebar: 280 };
    return (
      <div className="my-6 rounded-2xl overflow-hidden not-prose"
        style={{ border: '1px dashed var(--bdr2)', background: 'var(--bg3)', textAlign: 'center' }}>
        <span className="block text-[9px] font-bold uppercase tracking-widest pt-2 pb-1" style={{ color: 'var(--tm)' }}>
          Advertisement
        </span>
        <div className="rounded-xl mx-4 mb-4 flex items-center justify-center gap-3"
          style={{ minHeight: heights[slot] - 32, background: 'var(--bg2)' }}>
          {/* Megaphone icon — replaces  emoji */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            style={{ color: 'var(--tm)', opacity: .5 }}>
            <path d="M3 11l19-9-9 19-2-8-8-2z"/>
          </svg>
          <div className="text-left">
            <p className="text-xs font-semibold" style={{ color: 'var(--tm)' }}>Ad Slot: {slot}</p>
            <p className="text-[10px]" style={{ color: 'var(--tm)', opacity: .7 }}>Configure NEXT_PUBLIC_ADSENSE_CLIENT</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 overflow-hidden not-prose">
      <span className="block text-[9px] font-bold uppercase tracking-widest text-center mb-1" style={{ color: 'var(--tm)' }}>
        Advertisement
      </span>
      <ins ref={adRef} className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={CLIENT}
        data-ad-slot={AD_SLOTS[slot]}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

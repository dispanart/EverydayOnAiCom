'use client';

/**
 * AdSense.jsx — Google AdSense ad unit component
 *
 * Setup:
 * 1. Tambahkan ke Vercel env vars:
 *    NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXXX
 *
 * 2. Buat Ad Units di dashboard AdSense:
 *    - "Leaderboard"  → untuk atas/bawah artikel (728×90 atau responsive)
 *    - "Rectangle"    → untuk tengah artikel & sidebar (300×250)
 *    - "Auto"         → biarkan Google otomatis pilih ukuran terbaik
 *
 * 3. Isi AD_SLOTS di bawah dengan slot ID dari masing-masing ad unit
 *
 * 4. Uncomment bagian <GoogleAdSenseScript /> di layout.jsx
 */

import { useEffect, useRef } from 'react';

// ── Isi dengan Slot ID dari AdSense dashboard ─────────────────────
// AdSense → Ads → By ad unit → Display ads → nama unit → kode
export const AD_SLOTS = {
  leaderboard:   'XXXXXXXXXX',  // 728×90 — slot 1, setelah paragraf pertama
  'in-feed':     'XXXXXXXXXX',  // Native — slot 2, mid artikel
  rectangle:     'XXXXXXXXXX',  // 300×250 — slot 3
  'leaderboard-2': 'XXXXXXXXXX',// 728×90 — slot 4, hanya artikel ≥ 2000 kata
  sidebar:       'XXXXXXXXXX',  // 160×600 atau 300×600 — sidebar
};
// ─────────────────────────────────────────────────────────────────

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ;

export default function AdSense({ slot = 'leaderboard', format = 'auto', style = {} }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || !AD_SLOTS[slot] || AD_SLOTS[slot] === 'XXXXXXXXXX') return;
    if (pushed.current) return;
    try {
      pushed.current = true;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('[AdSense]', e);
    }
  }, [slot]);

  // Belum setup → tampilkan placeholder dummy
  if (!CLIENT || AD_SLOTS[slot] === 'XXXXXXXXXX') {
    const heights = { leaderboard: 90, 'in-feed': 150, rectangle: 250, 'leaderboard-2': 90, sidebar: 280 };
    return (
      <div className="my-6 rounded-2xl overflow-hidden border border-dashed border-slate-200
                      dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center not-prose">
        <span className="block text-[9px] text-slate-400 uppercase tracking-widest pt-2 pb-1">
          Advertisement
        </span>
        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl mx-4 mb-4 flex items-center
                        justify-center gap-3" style={{ minHeight: heights[slot] - 32 }}>
          <span className="text-2xl">📢</span>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-400">Ad Slot: {slot}</p>
            <p className="text-[10px] text-slate-400">Isi NEXT_PUBLIC_ADSENSE_CLIENT & AD_SLOTS</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 overflow-hidden not-prose">
      <span className="block text-[9px] text-slate-400 uppercase tracking-widest text-center mb-1">
        Advertisement
      </span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={CLIENT}
        data-ad-slot={AD_SLOTS[slot]}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

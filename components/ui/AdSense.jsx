'use client';

import { useEffect, useMemo } from 'react';

export const AD_SLOTS = {
  homeTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP || '',
  homeInFeed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_INFEED || '',
  homeBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_BOTTOM || '',
  sidebarTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_TOP || '',
  sidebarBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR_BOTTOM || '',
  articleTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_TOP || '',
  articleBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_BOTTOM || '',
  articlesTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLES_TOP || '',
  toolsTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOLS_TOP || '',
};

function adsEnabled() {
  return process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
}

export function canShowAds(slot) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return Boolean(adsEnabled() && client && slot);
}

export default function AdSense({
  slot,
  className = '',
  style = {},
  format = 'auto',
  layout = '',
  layoutKey = '',
  fullWidthResponsive = true,
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const enabled = canShowAds(slot);

  const insProps = useMemo(() => {
    const props = {
      className: 'adsbygoogle',
      style: { display: 'block', ...style },
      'data-ad-client': client,
      'data-ad-slot': slot,
      'data-ad-format': format,
      'data-full-width-responsive': fullWidthResponsive ? 'true' : 'false',
    };
    if (layout) props['data-ad-layout'] = layout;
    if (layoutKey) props['data-ad-layout-key'] = layoutKey;
    return props;
  }, [client, slot, format, fullWidthResponsive, layout, layoutKey, style]);

  useEffect(() => {
    if (!enabled) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      // Prevent ad script issues from breaking the page UI.
    }
  }, [enabled, slot]);

  if (!enabled) return null;

  return (
    <div className={`eonai-ad ${className}`.trim()} aria-label="Advertisement">
      <ins {...insProps} />
    </div>
  );
}

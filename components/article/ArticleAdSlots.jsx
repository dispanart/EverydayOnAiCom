'use client';

/**
 * ArticleAdSlots — Inject AdSense slots based on article word count.
 *
 * Word count < 2,000  → 3 ad slots (after para 2, para 5, end)
 * Word count ≥ 2,000  → 4 ad slots (after para 2, para 5, middle, end)
 *
 * After AdSense approved:
 * 1. Set NEXT_PUBLIC_ADSENSE_CLIENT in Vercel
 * 2. Fill AD_SLOTS in components/ui/AdSense.jsx
 * 3. Uncomment GoogleAdSenseScript in layout.jsx
 */

import { useMemo } from 'react';
import AdSense from '@/components/ui/AdSense';
import ArticleContent from '@/components/article/ArticleContent';

/** Count words in HTML string (strips tags first) */
function wordCount(html) {
  if (!html) return 0;
  return html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
}

/** Split HTML after the Nth closing </p> tag. Returns [before, after]. */
function splitAfterParagraph(html, afterNth) {
  let count = 0;
  let idx = 0;
  while (idx < html.length) {
    const found = html.indexOf('</p>', idx);
    if (found === -1) break;
    count++;
    if (count === afterNth) {
      return [html.slice(0, found + 4), html.slice(found + 4)];
    }
    idx = found + 4;
  }
  return [html, ''];
}

/** Count </p> occurrences in HTML */
function paragraphCount(html) {
  return (html?.match(/<\/p>/g) || []).length;
}

export default function ArticleAdSlots({ html }) {
  const parts = useMemo(() => {
    if (!html) return { p1: html, p2: null, p3: null, p4: null };

    const words  = wordCount(html);
    const paras  = paragraphCount(html);
    const isLong = words >= 2000; // 4 slots if ≥ 2000 words, 3 slots if less

    // Need at least 4 paragraphs to inject anything
    if (paras < 4) return { p1: html, p2: null, p3: null, p4: null };

    // ── Slot positions ────────────────────────────────────────────
    // Slot 1: after paragraph 2
    // Slot 2: after paragraph 5 (or halfway if article is short)
    // Slot 3: after middle of article (only for long articles)
    // Final:  remaining content after last split

    const slot1After = Math.min(2, Math.floor(paras * 0.2));
    const slot2After = Math.min(5, Math.floor(paras * 0.4));

    const [p1, rest1] = splitAfterParagraph(html, slot1After);
    const [p2, rest2] = splitAfterParagraph(rest1, slot2After - slot1After);

    if (!isLong) {
      // 3 slots: inject after para 2, after para 5, then rest is p3 (end)
      // AdSense layout: [p1] AD [p2] AD [p3(rest2)] AD
      return { p1, p2, p3: rest2, p4: null };
    }

    // 4 slots: split rest2 roughly in half for a mid-article slot
    const rest2Paras  = paragraphCount(rest2);
    const midAfter    = Math.max(1, Math.floor(rest2Paras / 2));
    const [p3, p4]    = splitAfterParagraph(rest2, midAfter);

    return { p1, p2, p3, p4 };
  }, [html]);

  // ── Render ────────────────────────────────────────────────────
  // Short article  (3 slots): p1 → AD → p2 → AD → p3 → AD
  // Long article   (4 slots): p1 → AD → p2 → AD → p3 → AD → p4 → AD

  if (!parts.p2) {
    // Not enough paragraphs — render without any ads
    return <ArticleContent html={parts.p1} />;
  }

  return (
    <>
      {/* Section 1 */}
      <ArticleContent html={parts.p1} />

      {/* Ad Slot 1 — Leaderboard */}
      <AdSense slot="leaderboard" />

      {/* Section 2 */}
      <ArticleContent html={parts.p2} />

      {/* Ad Slot 2 — In-Feed */}
      <AdSense slot="in-feed" />

      {/* Section 3 */}
      <ArticleContent html={parts.p3} />

      {/* Ad Slot 3 — Rectangle */}
      <AdSense slot="rectangle" />

      {/* Section 4 + Ad Slot 4 — only for long articles (≥ 2000 words) */}
      {parts.p4 && (
        <>
          <ArticleContent html={parts.p4} />
          <AdSense slot="leaderboard-2" />
        </>
      )}
    </>
  );
}

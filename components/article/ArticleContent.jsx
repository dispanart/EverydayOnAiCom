'use client';

import { useEffect, useRef } from 'react';

/**
 * ArticleContent — renders WordPress HTML with mobile-responsive fixes.
 *
 * Fixes applied after mount:
 * 1. Wraps ALL tables (including those inside wp-block-table figure) in .table-scroll
 * 2. Wraps figure.wp-block-table itself for proper overflow containment
 * 3. Makes iframes responsive with aspect-ratio wrapper
 * 4. Ensures images never overflow
 * 5. Fixes WordPress wide/full-align blocks
 */
export default function ArticleContent({ html, className = 'article-prose' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    // ── 1. Handle figure.wp-block-table (Gutenberg table block) ─────
    // Must be done BEFORE wrapping bare <table> to avoid double-wrapping
    const figureBlocks = ref.current.querySelectorAll('figure.wp-block-table');
    figureBlocks.forEach((figure) => {
      if (figure.parentElement?.classList.contains('table-scroll')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      figure.parentNode.insertBefore(wrapper, figure);
      wrapper.appendChild(figure);

      // Make the figure itself transparent so .table-scroll controls overflow
      figure.style.overflowX = 'visible';
      figure.style.margin = '0';
      figure.style.width = 'max-content';
      figure.style.minWidth = '100%';
    });

    // ── 2. Wrap bare <table> elements not inside figure.wp-block-table ─
    const tables = ref.current.querySelectorAll('table');
    tables.forEach((table) => {
      if (table.parentElement?.classList.contains('table-scroll')) return;
      // Skip tables already inside a wrapped figure
      if (table.closest('.table-scroll')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // ── 3. Make iframes (YouTube, etc) responsive ────────────────────
    const iframes = ref.current.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      if (iframe.parentElement?.classList.contains('iframe-wrap')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'iframe-wrap';
      iframe.parentNode.insertBefore(wrapper, iframe);
      wrapper.appendChild(iframe);
    });

    // ── 4. Ensure all images never overflow ──────────────────────────
    const images = ref.current.querySelectorAll('img');
    images.forEach((img) => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
    });

    // ── 5. Fix WordPress alignwide / alignfull blocks ────────────────
    const wideBlocks = ref.current.querySelectorAll('.alignwide, .alignfull');
    wideBlocks.forEach((block) => {
      block.style.maxWidth = '100%';
      block.style.overflowX = 'auto';
    });

  }, [html]);

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html || '' }}
    />
  );
}

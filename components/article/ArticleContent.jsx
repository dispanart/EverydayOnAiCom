'use client';

import { useEffect, useRef } from 'react';

/**
 * ArticleContent — renders WordPress HTML with full script execution support.
 *
 * Why scripts need special handling:
 *   Browser security rules prevent <script> tags injected via innerHTML from
 *   executing automatically. dangerouslySetInnerHTML uses innerHTML internally,
 *   so any <script> tag in WordPress content — including interactive widgets,
 *   calculators, estimators, and custom tools — is silently ignored.
 *
 * This component solves that by:
 *   1. Rendering the HTML normally via dangerouslySetInnerHTML
 *   2. After mount, finding every <script> tag in the rendered content
 *   3. Cloning each script into a NEW <script> element and appending it to
 *      the article container — which triggers proper browser execution
 *   4. Cleaning up all injected scripts on unmount / html change
 *
 * Other fixes applied after mount:
 *   5. Wraps tables (including Gutenberg wp-block-table) in .table-scroll
 *   6. Makes iframes responsive with aspect-ratio wrapper
 *   7. Ensures images never overflow
 *   8. Fixes WordPress alignwide / alignfull blocks
 */
export default function ArticleContent({ html, className = 'article-prose' }) {
  const ref = useRef(null);
  // Track injected <script> nodes so we can clean them up
  const injectedScripts = useRef([]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // ── CLEANUP: remove previously injected scripts ───────────────────────
    injectedScripts.current.forEach((s) => s.remove());
    injectedScripts.current = [];

    // ── 1. EXECUTE INLINE <script> TAGS ──────────────────────────────────
    //
    // Find every <script> the WordPress HTML contains.
    // dangerouslySetInnerHTML renders them as inert DOM nodes — we need to
    // clone each one into a live <script> element to make the browser run it.
    //
    const scriptNodes = Array.from(container.querySelectorAll('script'));

    scriptNodes.forEach((originalScript) => {
      const newScript = document.createElement('script');

      // Copy all attributes (type, src, async, defer, id, data-* etc.)
      Array.from(originalScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      if (originalScript.src) {
        // External script: set src, browser will fetch & execute
        newScript.src = originalScript.src;
        newScript.async = true;
      } else {
        // Inline script: copy the JS text
        newScript.textContent = originalScript.textContent;
      }

      // Append to the container (not document.head) so it stays scoped to
      // the article and gets cleaned up with it
      container.appendChild(newScript);
      injectedScripts.current.push(newScript);

      // Hide the original inert node so there's no duplicate DOM noise
      originalScript.style.display = 'none';
    });

    // ── 2. Handle figure.wp-block-table (Gutenberg table block) ──────────
    const figureBlocks = container.querySelectorAll('figure.wp-block-table');
    figureBlocks.forEach((figure) => {
      if (figure.parentElement?.classList.contains('table-scroll')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      figure.parentNode.insertBefore(wrapper, figure);
      wrapper.appendChild(figure);
      figure.style.overflowX = 'visible';
      figure.style.margin = '0';
      figure.style.width = 'max-content';
      figure.style.minWidth = '100%';
    });

    // ── 3. Wrap bare <table> not already inside .table-scroll ────────────
    const tables = container.querySelectorAll('table');
    tables.forEach((table) => {
      if (table.parentElement?.classList.contains('table-scroll')) return;
      if (table.closest('.table-scroll')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // ── 4. Make iframes (YouTube, embeds etc.) responsive ─────────────────
    const iframes = container.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      if (iframe.parentElement?.classList.contains('iframe-wrap')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'iframe-wrap';
      iframe.parentNode.insertBefore(wrapper, iframe);
      wrapper.appendChild(iframe);
    });

    // ── 5. Ensure images never overflow ──────────────────────────────────
    const images = container.querySelectorAll('img');
    images.forEach((img) => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
    });

    // ── 6. Fix WordPress alignwide / alignfull ────────────────────────────
    const wideBlocks = container.querySelectorAll('.alignwide, .alignfull');
    wideBlocks.forEach((block) => {
      block.style.maxWidth = '100%';
      block.style.overflowX = 'auto';
    });

    // ── CLEANUP on unmount / html change ─────────────────────────────────
    return () => {
      injectedScripts.current.forEach((s) => s.remove());
      injectedScripts.current = [];
    };

  }, [html]);

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html || '' }}
    />
  );
}

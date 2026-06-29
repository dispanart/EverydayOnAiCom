'use client';

import { useEffect, useRef } from 'react';

/**
 * ArticleContent — renders WordPress HTML with full script execution support.
 *
 * CONTEXT:
 * WordPress strips <script> tags via wp_kses_post before sending to REST API.
 * This component handles BOTH scenarios:
 * 1. Script exists in HTML (wp_kses disabled via plugin) → clone & execute
 * 2. Script stripped by WordPress, only onclick/data-script remain → reconstruct
 *
 * HOW IT WORKS:
 * 1. After mount, find & clone all <script> tags → browser executes them
 * 2. Scan for data-widget-script attributes → inject script from attribute value
 * 3. Fix tables, iframes, images for mobile
 * 4. Cleanup all injected scripts on unmount
 */
export default function ArticleContent({ html, className = 'article-prose aib' }) {
 const ref = useRef(null);
 const injectedScripts = useRef([]);

 useEffect(() => {
 const container = ref.current;
 if (!container) return;

 // Cleanup sebelumnya
 injectedScripts.current.forEach(s => s.remove());
 injectedScripts.current = [];

 // ── 1. Clone & eksekusi semua <script> tags ───────────────────────────
 const scriptNodes = Array.from(container.querySelectorAll('script'));
 scriptNodes.forEach(orig => {
 // Skip ld+json — tidak perlu dieksekusi
 if (orig.type === 'application/ld+json') return;

 const s = document.createElement('script');
 Array.from(orig.attributes).forEach(a => s.setAttribute(a.name, a.value));

 if (orig.src) {
 s.src = orig.src;
 s.async = true;
 } else {
 s.textContent = orig.textContent;
 }

 container.appendChild(s);
 injectedScripts.current.push(s);
 orig.style.display = 'none';
 });

 // ── 2. Scan data-widget-script attributes (fallback jika WP strip script) ─
 // Cara pakai di WordPress: tambahkan ke elemen manapun di artikel:
 // <div data-widget-script="function myWidget(){...}"></div>
 const widgetEls = container.querySelectorAll('[data-widget-script]');
 widgetEls.forEach(el => {
 const code = el.getAttribute('data-widget-script');
 if (!code) return;
 const s = document.createElement('script');
 s.textContent = decodeURIComponent(code);
 container.appendChild(s);
 injectedScripts.current.push(s);
 });

 // ── 3. Wrap tables ────────────────────────────────────────────────────
 container.querySelectorAll('figure.wp-block-table').forEach(fig => {
 if (fig.parentElement?.classList.contains('table-scroll')) return;
 const w = document.createElement('div');
 w.className = 'table-scroll';
 fig.parentNode.insertBefore(w, fig);
 w.appendChild(fig);
 });
 container.querySelectorAll('table').forEach(t => {
 if (t.closest('.table-scroll')) return;
 const w = document.createElement('div');
 w.className = 'table-scroll';
 t.parentNode.insertBefore(w, t);
 w.appendChild(t);
 });

 // ── 4. Responsive iframes ─────────────────────────────────────────────
 container.querySelectorAll('iframe').forEach(fr => {
 if (fr.parentElement?.classList.contains('iframe-wrap')) return;
 const w = document.createElement('div');
 w.className = 'iframe-wrap';
 fr.parentNode.insertBefore(w, fr);
 w.appendChild(fr);
 });

 // ── 5. Images overflow fix ────────────────────────────────────────────
 container.querySelectorAll('img').forEach(img => {
 img.style.maxWidth = '100%';
 img.style.height = 'auto';
 });

 return () => {
 injectedScripts.current.forEach(s => s.remove());
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

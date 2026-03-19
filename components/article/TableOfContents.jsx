'use client';

import { useState, useEffect, useRef } from 'react';
import { List } from 'lucide-react';

// Extract headings from raw WordPress HTML
function extractHeadings(html) {
  if (!html || typeof window === 'undefined') return [];
  const div = document.createElement('div');
  div.innerHTML = html;
  const nodes = div.querySelectorAll('h2, h3');
  return Array.from(nodes).map((el, i) => {
    const id = el.id || `heading-${i}`;
    el.id = id;
    return { id, text: el.textContent.trim(), level: parseInt(el.tagName[1]) };
  });
}

export default function TableOfContents({ content }) {
  const [headings, setHeadings]   = useState([]);
  const [activeId, setActiveId]   = useState('');
  const [progress, setProgress]   = useState(0);
  const observerRef               = useRef(null);

  // Extract headings after mount
  useEffect(() => {
    const h = extractHeadings(content);
    setHeadings(h);
  }, [content]);

  // Inject IDs into real DOM headings & observe
  useEffect(() => {
    if (!headings.length) return;

    // Give IDs to actual article headings in DOM
    const article = document.querySelector('.article-prose');
    if (!article) return;

    const domHeadings = article.querySelectorAll('h2, h3');
    domHeadings.forEach((el, i) => {
      if (!el.id) el.id = `heading-${i}`;
    });

    // IntersectionObserver to highlight active heading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    domHeadings.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, [headings]);

  // Reading progress
  useEffect(() => {
    const update = () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setProgress(Math.min(pct, 100));
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents"
         className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 shadow-sm sticky top-24">
      <h3 className="flex items-center gap-2 text-xs font-extrabold text-slate-700
                    uppercase tracking-wider mb-4">
        <List size={13} className="text-blue-600" />
        Daftar Isi
      </h3>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <button
              onClick={() => scrollTo(h.id)}
              className={`w-full text-left text-sm leading-snug py-1.5 px-2 rounded-lg
                         transition-all duration-150 border-l-2
                         ${h.level === 3 ? 'pl-5' : ''}
                         ${activeId === h.id
                           ? 'border-blue-500 text-blue-600 bg-blue-50 font-semibold'
                           : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                         }`}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

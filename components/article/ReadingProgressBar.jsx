'use client';

import { useEffect } from 'react';

export function ReadingProgressBar() {
  useEffect(() => {
    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    bar.style.width = '0';
    document.body.appendChild(bar);

    const update = () => {
      const scrollTop = window.pageYOffset;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
      bar.style.width = `${pct}%`;
    };

    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      bar.remove();
    };
  }, []);

  return null;
}

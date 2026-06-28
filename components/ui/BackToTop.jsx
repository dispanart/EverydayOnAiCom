'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:-translate-y-1"
      style={{
        background: 'linear-gradient(135deg,var(--c1),var(--c2))',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(41,53,129,.3)',
      }}
    >
      <ChevronUp size={18} />
    </button>
  );
}

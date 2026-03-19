'use client';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-blue-600 hover:bg-blue-700
                 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center
                 justify-center transition-all hover:scale-110 active:scale-95"
    >
      <ArrowUp size={18} />
    </button>
  );
}

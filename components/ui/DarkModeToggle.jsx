'use client';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('eai_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('eai_theme', next ? 'dark' : 'light');
  }

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
      style={{ border: '1px solid var(--bdr)', background: 'var(--sur)', color: 'var(--ts)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c2)'; e.currentTarget.style.color = 'var(--c2)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bdr)'; e.currentTarget.style.color = 'var(--ts)'; }}>
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

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
    <button onClick={toggle} aria-label={dark ? 'Light mode' : 'Dark mode'}
      className="w-9 h-9 rounded-lg flex items-center justify-center
                 text-slate-500 hover:text-blue-600 hover:bg-blue-50
                 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-800
                 transition-all">
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

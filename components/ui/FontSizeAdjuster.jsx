'use client';
import { useState, useEffect } from 'react';
import { Type } from 'lucide-react';

const SIZES = ['eonai-font-sm', 'eonai-font-md', 'eonai-font-lg'];
const LABELS = ['S', 'M', 'L'];
const KEY = 'eai_font_size';

export default function FontSizeAdjuster() {
 const [idx, setIdx] = useState(1);
 const [open, setOpen] = useState(false);

 useEffect(() => {
 const saved = localStorage.getItem(KEY);
 if (saved) {
 const parsed = parseInt(saved, 10);
 const i = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), SIZES.length - 1) : 1;
 setIdx(i);
 applySize(i);
 }
 }, []);

 function applySize(i) {
 const prose = document.querySelector('.article-prose');
 if (!prose) return;
 SIZES.forEach(s => prose.classList.remove(s));
 prose.classList.add(SIZES[i] || SIZES[1]);
 }

 function setSize(i) {
 setIdx(i);
 applySize(i);
 localStorage.setItem(KEY, String(i));
 setOpen(false);
 }

 return (
 <div className="relative">
 <button onClick={() => setOpen(o => !o)} title="Text size"
 className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200
 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-semibold transition-all">
 <Type size={13} />{LABELS[idx]}
 </button>
 {open && (
 <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 flex gap-1">
 {LABELS.map((l, i) => (
 <button key={l} onClick={() => setSize(i)}
 className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors
 ${idx === i ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
 {l}
 </button>
 ))}
 </div>
 )}
 </div>
 );
}

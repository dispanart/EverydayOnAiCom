'use client';

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
 const [show, setShow] = useState(false);
 const [progress, setProgress] = useState(0);

 useEffect(() => {
 const onScroll = () => {
 const st = window.scrollY || window.pageYOffset;
 const dh = document.documentElement.scrollHeight - window.innerHeight;
 setProgress(dh > 0 ? Math.min(100, (st / dh) * 100) : 0);
 setShow(st > 400);
 };
 onScroll();
 window.addEventListener('scroll', onScroll, { passive: true });
 window.addEventListener('resize', onScroll);
 return () => {
 window.removeEventListener('scroll', onScroll);
 window.removeEventListener('resize', onScroll);
 };
 }, []);

 return (
 <>
 <div id="pb" style={{ width: `${progress}%` }} />
 <button
 id="stt"
 className={show ? 'show' : ''}
 onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
 aria-label="Back to top"
 >
 <ChevronUp size={17} strokeWidth={2.5} />
 </button>
 </>
 );
}

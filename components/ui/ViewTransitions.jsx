'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ViewTransitions() {
 const router = useRouter();

 useEffect(() => {
 if (!document.startViewTransition) return;

 const onClick = (event) => {
 if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

 const anchor = event.target.closest('a[href]');
 if (!anchor) return;
 if (anchor.target && anchor.target !== '_self') return;
 if (anchor.hasAttribute('download')) return;

 const url = new URL(anchor.href, window.location.href);
 if (url.origin !== window.location.origin) return;
 if (url.pathname === window.location.pathname && url.search === window.location.search) return;

 event.preventDefault();
 document.startViewTransition(() => {
 router.push(`${url.pathname}${url.search}${url.hash}`);
 });
 };

 document.addEventListener('click', onClick);
 return () => document.removeEventListener('click', onClick);
 }, [router]);

 return null;
}

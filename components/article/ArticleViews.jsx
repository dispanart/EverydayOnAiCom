'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

const VIEW_CACHE_TTL = 1000 * 60 * 60 * 24 * 7;

function formatViews(value) {
 const n = Number(value || 0);
 if (n >= 1000000) return `${(n / 1000000).toFixed(n >= 10000000 ? 0 : 1)}M`;
 if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
 return n.toLocaleString('en-US');
}

function cacheKey(postId) {
 return `eonai_article_views_${postId}`;
}

function readCachedViews(postId) {
 if (typeof window === 'undefined' || !postId) return null;
 try {
 const raw = window.localStorage.getItem(cacheKey(postId));
 if (!raw) return null;
 const data = JSON.parse(raw);
 if (!data?.savedAt || typeof data.views !== 'number') return null;
 if (Date.now() - data.savedAt > VIEW_CACHE_TTL) return null;
 return data.views;
 } catch {
 return null;
 }
}

function writeCachedViews(postId, views) {
 if (typeof window === 'undefined' || !postId || typeof views !== 'number') return;
 try {
 window.localStorage.setItem(cacheKey(postId), JSON.stringify({
 views,
 savedAt: Date.now(),
 }));
 } catch {
 // Ignore storage errors; the counter still works for the current page view.
 }
}

export default function ArticleViews({ postId, initialViews = 0 }) {
 const [views, setViews] = useState(Number(initialViews || 0));
 const [ready, setReady] = useState(false);

 useEffect(() => {
 if (!postId) return;

 let active = true;
 const cachedViews = readCachedViews(postId);
 if (typeof cachedViews === 'number') {
 setViews(cachedViews);
 }

 fetch(`/api/views/${postId}`, { method: 'POST', cache: 'no-store' })
 .then((res) => res.json())
 .then((data) => {
 if (!active) return;
 if (typeof data.views === 'number' && typeof cachedViews !== 'number') {
 setViews(data.views);
 writeCachedViews(postId, data.views);
 }
 setReady(true);
 })
 .catch(() => {
 if (active) setReady(true);
 });

 return () => { active = false; };
 }, [postId]);

 if (!postId) return null;

 return (
 <span className="article-views" title={ready ? `${views.toLocaleString('en-US')} views` : 'Loading views'}>
 <Eye size={14} />
 <span>{formatViews(views)} views</span>
 </span>
 );
}

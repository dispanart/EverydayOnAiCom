'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

const DAY_MS = 1000 * 60 * 60 * 24;

function formatViews(value) {
  const n = Number(value || 0);
  if (n >= 1000000) return `${(n / 1000000).toFixed(n >= 10000000 ? 0 : 1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return n.toLocaleString('en-US');
}

function shouldCountView(postId) {
  try {
    const key = `eonai_viewed_${postId}`;
    const last = Number(localStorage.getItem(key) || 0);
    if (last && Date.now() - last < DAY_MS) return false;
    localStorage.setItem(key, String(Date.now()));
    return true;
  } catch {
    return true;
  }
}

export default function ArticleViews({ postId, initialViews = 0 }) {
  const [views, setViews] = useState(Number(initialViews || 0));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!postId) return undefined;

    let active = true;
    const method = shouldCountView(postId) ? 'POST' : 'GET';

    fetch(`/api/views/${postId}`, {
      method,
      cache: method === 'GET' ? 'force-cache' : 'no-store',
    })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (typeof data.views === 'number') setViews(data.views);
        setReady(true);
      })
      .catch(() => {
        if (active) setReady(true);
      });

    return () => { active = false; };
  }, [postId]);

  if (!postId) return null;

  return (
    <span className="article-views" title={ready ? `${views.toLocaleString('en-US')} views` : 'Loading cached views'}>
      <Eye size={14} />
      <span>{formatViews(views)} views</span>
    </span>
  );
}

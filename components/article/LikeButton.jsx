'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function LikeButton({ slug }) {
  const [count, setCount]   = useState(0);
  const [liked, setLiked]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Fetch initial like state
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/likes?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => { setCount(d.count ?? 0); setLiked(d.liked ?? false); })
      .catch(() => {});
  }, [slug]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((c) => wasLiked ? c - 1 : c + 1);
    if (!wasLiked) { setAnimate(true); setTimeout(() => setAnimate(false), 600); }

    try {
      const res  = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      setCount(data.count ?? 0);
      setLiked(data.liked ?? false);
    } catch {
      // Revert on error
      setLiked(wasLiked);
      setCount((c) => wasLiked ? c + 1 : c - 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      aria-label={liked ? 'Unlike artikel ini' : 'Like artikel ini'}
      className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-full
                  border-2 font-semibold text-sm transition-all duration-200
                  disabled:cursor-not-allowed select-none
                  ${liked
                    ? 'bg-red-50 border-red-400 text-red-500 hover:bg-red-100'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-400'
                  }`}
    >
      <Heart
        size={18}
        className={`transition-all duration-300
          ${liked ? 'fill-red-500 text-red-500' : 'fill-none group-hover:text-red-400'}
          ${animate ? 'scale-125' : 'scale-100'}`}
      />
      <span className={liked ? 'text-red-500' : ''}>
        {count > 0 ? count.toLocaleString() : '0'}
      </span>
      <span className="hidden sm:inline text-xs opacity-70">
        {liked ? 'Liked!' : 'Like'}
      </span>
    </button>
  );
}

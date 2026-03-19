'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';

// Generate or retrieve anonymous session ID
function getSession() {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem('eai_session');
  if (!id) {
    id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    localStorage.setItem('eai_session', id);
  }
  return id;
}

export default function BookmarkButton({ slug, title }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [session, setSession]       = useState(null);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (!s || !slug) return;

    // Check if already bookmarked
    fetch(`/api/bookmarks?session=${s}`)
      .then((r) => r.json())
      .then((d) => {
        const found = d.bookmarks?.some((b) => b.slug === slug);
        setBookmarked(found);
      })
      .catch(() => {});
  }, [slug]);

  const handleBookmark = async () => {
    if (loading || !session) return;
    setLoading(true);

    const wasBookmarked = bookmarked;
    setBookmarked(!wasBookmarked); // optimistic

    try {
      if (wasBookmarked) {
        await fetch(`/api/bookmarks?session=${session}&slug=${encodeURIComponent(slug)}`, {
          method: 'DELETE',
        });
      } else {
        await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session, slug, title }),
        });
      }
    } catch {
      setBookmarked(wasBookmarked); // revert
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      aria-label={bookmarked ? 'Hapus bookmark' : 'Simpan artikel ini'}
      title={bookmarked ? 'Hapus dari bookmark' : 'Simpan ke bookmark'}
      className={`group flex items-center gap-2 px-4 py-2.5 rounded-full
                  border-2 font-semibold text-sm transition-all duration-200
                  disabled:cursor-not-allowed
                  ${bookmarked
                    ? 'bg-blue-50 border-blue-400 text-blue-600 hover:bg-blue-100'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500'
                  }`}
    >
      <Bookmark
        size={16}
        className={`transition-all duration-200
          ${bookmarked ? 'fill-blue-500 text-blue-500' : 'fill-none group-hover:text-blue-400'}`}
      />
      <span className="hidden sm:inline text-xs">
        {bookmarked ? 'Disimpan' : 'Simpan'}
      </span>
    </button>
  );
}

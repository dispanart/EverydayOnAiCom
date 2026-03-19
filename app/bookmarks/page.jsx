'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Trash2, ExternalLink, BookOpen } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function getSession() {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem('eai_session');
  if (!id) {
    id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    localStorage.setItem('eai_session', id);
  }
  return id;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [session, setSession]     = useState(null);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (!s) { setLoading(false); return; }

    fetch(`/api/bookmarks?session=${s}`)
      .then((r) => r.json())
      .then((d) => setBookmarks(d.bookmarks ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const removeBookmark = async (slug) => {
    if (!session) return;
    setBookmarks((b) => b.filter((x) => x.slug !== slug)); // optimistic
    await fetch(`/api/bookmarks?session=${session}&slug=${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Bookmark size={18} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Artikel Tersimpan</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {loading ? '...' : `${bookmarks.length} artikel disimpan di perangkat ini`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500 font-semibold">No saved articles yet</p>
              <p className="text-slate-400 text-sm mt-1 mb-6">
                Klik tombol bookmark di artikel untuk menyimpannya di sini.
              </p>
              <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 text-white
                                        font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                Jelajahi Artikel
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((b) => (
                <div key={b.slug}
                     className="flex items-center justify-between gap-4 bg-white border border-slate-100
                               rounded-2xl p-4 hover:border-slate-200 transition-all group">
                  <Link href={`/${b.slug}`}
                        className="flex-1 min-w-0 group-hover:text-blue-600 transition-colors">
                    <p className="font-semibold text-slate-900 text-sm leading-snug truncate group-hover:text-blue-600">
                      {b.title || b.slug}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </Link>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/${b.slug}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          title="Buka artikel">
                      <ExternalLink size={15} />
                    </Link>
                    <button onClick={() => removeBookmark(b.slug)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            title="Hapus bookmark">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {bookmarks.length > 0 && (
            <p className="text-center text-xs text-slate-400 mt-8">
              Bookmark tersimpan di browser ini. Membersihkan cache browser akan menghapus bookmark.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

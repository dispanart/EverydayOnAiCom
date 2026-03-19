'use client';
import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, X, Calendar, Loader2 } from 'lucide-react';
import { CATEGORIES } from '@/config/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevansi' },
  { value: 'date_desc', label: 'Terbaru' },
  { value: 'date_asc',  label: 'Terlama' },
];

function stripHtml(html) { if (!html) return ''; const s = html.replace(/<[^>]*>/g, '').trim(); return s.replace(/&#(d+);/g, (_, c) => String.fromCharCode(parseInt(c,10))).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&ldquo;/g,'"').replace(/&rdquo;/g,'"').replace(/&rsquo;/g,"'").replace(/&nbsp;/g,' '); }
function fmtDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [query,      setQuery]      = useState(initialQ);
  const [category,   setCategory]   = useState('');
  const [sort,       setSort]       = useState('relevance');
  const [results,    setResults]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [searched,   setSearched]   = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const doSearch = useCallback(async (q, cat, s) => {
    if (!q?.trim()) return;
    setLoading(true); setSearched(true);
    try {
      const params = new URLSearchParams({ q, ...(cat && { category: cat }), sort: s });
      const res  = await fetch(`/api/search?${params}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch { setResults([]); }
    setLoading(false);
  }, []);

  // Auto-search when landing from header with ?q=
  useEffect(() => {
    if (initialQ) doSearch(initialQ, '', 'relevance');
  }, [initialQ, doSearch]);

  const handleSubmit = (e) => { e.preventDefault(); doSearch(query, category, sort); };
  const hasFilter = category || sort !== 'relevance';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
            Cari Artikel
          </h1>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="search" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Cari topik AI, tools, tips..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700
                           dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2
                           focus:ring-blue-500 focus:border-transparent text-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl
                         transition-colors disabled:opacity-60 flex items-center gap-2">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
              <span className="hidden sm:inline">Cari</span>
            </button>
            <button type="button" onClick={() => setShowFilter(f => !f)}
              className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-2 text-sm font-semibold
                ${showFilter || hasFilter ? 'border-blue-400 text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>
              <Filter size={15} />
              {hasFilter && <span className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
          </form>

          {/* Filters */}
          {showFilter && (
            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Filter & Urutkan</span>
                {hasFilter && (
                  <button onClick={() => { setCategory(''); setSort('relevance'); }}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                    <X size={11} /> Reset
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5">Kategori</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700
                               bg-white dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Semua Kategori</option>
                    {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5">Urutkan</label>
                  <select value={sort} onChange={e => setSort(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700
                               bg-white dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
            </div>
          ) : searched && results.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Search size={40} className="mx-auto mb-4 opacity-20" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">No results for &quot;{query}&quot;</p>
              <p className="text-sm mt-1">Coba kata kunci lain atau hapus filter</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-400">{results.length} hasil ditemukan untuk &quot;{query}&quot;</p>
              {results.map(post => {
                const img = post.featuredImage?.node;
                return (
                  <Link key={post.id} href={`/${post.slug}`}
                    className="flex gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800
                               rounded-2xl hover:border-slate-200 hover:shadow-sm transition-all group">
                    {img?.sourceUrl && (
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={img.sourceUrl} alt={img.altText || post.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-slate-900 dark:text-white text-sm leading-snug mb-1
                                     group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-slate-500 text-xs line-clamp-2 mb-2">{stripHtml(post.excerpt).slice(0, 120)}...</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Calendar size={10} />{fmtDate(post.date)}</span>
                        {post.categories?.nodes?.[0] && (
                          <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                            {post.categories.nodes[0].name}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-300">
              <Search size={48} className="mx-auto mb-4" />
              <p className="text-slate-400">Ketik kata kunci untuk mulai mencari</p>
            </div>
          )}
        </div>
      </main>
      <BackToTop />
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>}>
      <SearchContent />
    </Suspense>
  );
}

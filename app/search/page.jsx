'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, X, Calendar, Loader2, ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '@/config/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';
import { loadSearchIndex, searchLocalPosts } from '@/lib/searchIndexClient';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date_desc', label: 'Newest' },
  { value: 'date_asc', label: 'Oldest' },
];

function stripHtml(html) {
  if (!html) return '';
  const s = html.replace(/<[^>]*>/g, '').trim();
  return s
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(parseInt(c, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&rsquo;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ResultCard({ post }) {
  const img = post.featuredImage?.node;
  return (
    <Link
      href={`/${post.slug}`}
      className="search-result-card group"
    >
      {img?.sourceUrl && (
        <div className="search-result-image">
          <Image src={img.sourceUrl} alt={img.altText || post.title} fill sizes="96px" className="object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h2 className="search-result-title group-hover:text-blue-600">
          {post.title}
        </h2>
        <p className="search-result-excerpt">{stripHtml(post.excerpt).slice(0, 130)}...</p>
        <div className="search-result-meta">
          <span className="flex items-center gap-1"><Calendar size={10} />{fmtDate(post.modifiedGmt || post.date)}</span>
          {post.categories?.nodes?.[0] && (
            <span className="search-result-category">{post.categories.nodes[0].name}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('relevance');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [focused, setFocused] = useState(false);

  const doSearch = useCallback(async (q, cat, s) => {
    const term = q?.trim();
    if (!term) return;

    setLoading(true);
    setSearched(true);
    setSearchError('');

    try {
      const posts = await loadSearchIndex();
      setResults(searchLocalPosts(posts, term, { category: cat, sort: s, limit: 24 }));
    } catch (error) {
      setResults([]);
      setSearchError('Search index is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQ) doSearch(initialQ, '', 'relevance');
  }, [initialQ, doSearch]);

  useEffect(() => {
    const term = query.trim();

    if (term.length < 2) {
      setSuggestions([]);
      setSuggesting(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSuggesting(true);
      try {
        const posts = await loadSearchIndex();
        setSuggestions(searchLocalPosts(posts, term, { category, limit: 6, titleOnly: true }));
      } catch {
        setSuggestions([]);
      } finally {
        setSuggesting(false);
      }
    }, 90);

    return () => {
      clearTimeout(timer);
    };
  }, [query, category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFocused(false);
    doSearch(query, category, sort);
  };
  const hasFilter = category || sort !== 'relevance';
  const showSuggestions = focused && query.trim().length >= 2;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <div className="search-page-wrap">
          <h1 className="search-page-title">Search Articles</h1>

          <form onSubmit={handleSubmit} className="search-page-form">
            <div className="search-page-input-wrap">
              <Search size={16} className="search-page-icon" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 160)}
                placeholder="Search AI topics, tools, tips..."
                className="search-page-input"
              />
              {showSuggestions && (
                <div className="search-suggest-panel">
                  <div className="search-suggest-head">
                    <span>Suggestions</span>
                    {suggesting && <Loader2 size={14} className="animate-spin" />}
                  </div>
                  {suggestions.length > 0 ? suggestions.map((post) => (
                    <Link key={post.id} href={`/${post.slug}`} className="search-suggest-item">
                      <span className="search-suggest-title">{post.title}</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  )) : (
                    <div className="search-suggest-empty">
                      {suggesting ? 'Looking for matching articles...' : 'Keep typing or press Search.'}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button type="submit" disabled={loading || !query.trim()} className="search-page-button">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
              <span className="hidden sm:inline">Search</span>
            </button>
            <button type="button" onClick={() => setShowFilter((f) => !f)} className={`search-filter-button ${showFilter || hasFilter ? 'active' : ''}`}>
              <Filter size={15} />
              {hasFilter && <span className="search-filter-dot" />}
            </button>
          </form>

          {showFilter && (
            <div className="search-filter-panel">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Filter & Sort</span>
                {hasFilter && (
                  <button onClick={() => { setCategory(''); setSort('relevance'); }} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                    <X size={11} /> Reset
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="search-select">
                    <option value="">All Categories</option>
                    {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5">Sort</label>
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="search-select">
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {searchError && <div className="search-error">{searchError}</div>}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="search-skeleton" />)}
            </div>
          ) : searched && results.length === 0 ? (
            <div className="search-empty-state">
              <Search size={40} className="mx-auto mb-4 opacity-20" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">No results for &quot;{query}&quot;</p>
              <p className="text-sm mt-1">Try another keyword or remove filters.</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-400">{results.length} results found for &quot;{query}&quot;</p>
              {results.map((post) => <ResultCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="search-empty-state">
              <Search size={48} className="mx-auto mb-4" />
              <p className="text-slate-400">Type a keyword to start searching.</p>
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

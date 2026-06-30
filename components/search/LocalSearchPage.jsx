'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { getLocalSearchIndex, searchLocalTitles } from './localSearch';

export default function LocalSearchPage({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getLocalSearchIndex());
  }, []);

  const results = useMemo(() => searchLocalTitles(query, items, 30), [query, items]);
  const hasQuery = query.trim().length >= 2;

  return (
    <section className="search-page-section">
      <div className="search-page-card">
        <div className="search-page-label">Local title search</div>
        <h1>Search EverydayOnAI</h1>
        <p>Search suggestions run in your browser from a cached article-title index, so this feature does not call Vercel API routes while you type.</p>
        <div className="search-page-input-wrap">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type an article title..."
            aria-label="Search article titles"
            autoFocus
          />
        </div>
      </div>

      <div className="search-page-results">
        {!hasQuery ? (
          <div className="search-page-empty">Type at least 2 characters to search article titles.</div>
        ) : results.length ? (
          results.map((item) => (
            <Link key={item.slug} href={`/${item.slug}`} className="search-result-card">
              <span className="search-result-category">{item.category || 'Article'}</span>
              <h2>{item.title}</h2>
              <span className="search-result-link">Read article</span>
            </Link>
          ))
        ) : (
          <div className="search-page-empty">No article titles matched “{query}”.</div>
        )}
      </div>
    </section>
  );
}

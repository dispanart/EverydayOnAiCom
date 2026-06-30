'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { getLocalSearchIndex, searchLocalTitles } from './localSearch';

export default function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    setItems(getLocalSearchIndex());
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('searching', open);
    return () => document.documentElement.classList.remove('searching');
  }, [open]);

  useEffect(() => {
    function onClickOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const suggestions = useMemo(() => searchLocalTitles(query, items, 7), [query, items]);

  function submit(event) {
    event.preventDefault();
    const first = suggestions[0];
    if (first?.slug) {
      window.location.href = `/${first.slug}`;
      return;
    }
    if (query.trim().length >= 2) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  }

  function close() {
    setQuery('');
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className={`header-search ${open ? 'open' : ''}`}>
      <form className="srch" role="search" onSubmit={submit}>
        <Search size={14} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          placeholder="Search article titles..."
          aria-label="Search article titles"
          autoComplete="off"
        />
        {query ? (
          <button type="button" className="search-clear" onClick={close} aria-label="Clear search">
            <X size={14} />
          </button>
        ) : null}
      </form>

      {open && query.trim().length >= 2 ? (
        <div className="search-suggest" role="listbox" aria-label="Article title suggestions">
          {suggestions.length ? suggestions.map((item) => (
            <Link key={item.slug} href={`/${item.slug}`} className="search-suggest-item" onClick={() => setOpen(false)}>
              <span className="search-suggest-title">{item.title}</span>
              <span className="search-suggest-meta">{item.category || 'Article'}</span>
            </Link>
          )) : (
            <div className="search-suggest-empty">No matching article titles.</div>
          )}
          <Link href={`/search?q=${encodeURIComponent(query.trim())}`} className="search-suggest-all" onClick={() => setOpen(false)}>
            View all matches
          </Link>
        </div>
      ) : null}
    </div>
  );
}

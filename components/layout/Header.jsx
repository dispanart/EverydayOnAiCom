'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, Moon, Sun, Loader2, ArrowUpRight, Clock } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles' },
  { label: 'AI Tools', href: '/tools' },
  { label: 'About', href: '/about' },
];

const mobileLinks = [
  { label: 'Home', href: '/' },
  { label: 'Article', href: '/articles' },
  { label: 'AI Tools', href: '/tools' },
  { label: 'About', href: '/about' },
];

const RECENT_KEY = 'eai_recent_searches';
const MAX_RECENT = 5;

function isActive(pathname, href) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

async function fetchHeaderSuggestions(q, signal) {
  const params = new URLSearchParams({ q, limit: '6' });
  const res = await fetch(`/api/search/suggest?${params}`, { signal, cache: 'no-store' });
  const data = await res.json();
  return data.results ?? [];
}

function getRecentSearches() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecentSearch(term) {
  if (typeof window === 'undefined' || !term.trim()) return;
  try {
    const existing = getRecentSearches().filter((t) => t.toLowerCase() !== term.toLowerCase());
    const updated = [term, ...existing].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch { /* ignore quota errors */ }
}

/** Highlight the matched query substring inside a title */
function HighlightMatch({ text, query }) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark style={{ background: 'rgba(66,116,217,.18)', color: 'inherit', borderRadius: 3, padding: '0 1px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggesting, setSuggesting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const abortRef = useRef(null);
  const searchInputRef = useRef(null);
  const suggestionRefs = useRef([]);
  const clickingSuggestionRef = useRef(false);

  useEffect(() => {
    setMobileOpen(false);
    setSuggestions([]);
    setSearchFocused(false);
    document.documentElement.classList.remove('searching');
  }, [pathname]);

  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark';
    setDark(theme);
  }, []);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [searchFocused]);

  useEffect(() => {
    const term = query.trim();
    abortRef.current?.abort?.();
    setActiveIndex(-1);

    if (!searchFocused || term.length < 2) {
      setSuggestions([]);
      setSuggesting(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    // Slightly longer debounce reduces redundant requests while typing fast
    const timer = setTimeout(async () => {
      setSuggesting(true);
      try {
        const items = await fetchHeaderSuggestions(term, controller.signal);
        // Guard against stale responses if user kept typing
        if (!controller.signal.aborted) setSuggestions(items);
      } catch (err) {
        if (err?.name !== 'AbortError') setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setSuggesting(false);
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, searchFocused]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('t', next ? 'dark' : 'light');
    localStorage.setItem('eai_theme', next ? 'dark' : 'light');
  }

  const goToSearch = useCallback((term) => {
    const q = term.trim();
    if (!q) return;
    saveRecentSearch(q);
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setQuery('');
    setSuggestions([]);
    setSearchFocused(false);
    setActiveIndex(-1);
    document.documentElement.classList.remove('searching');
    searchInputRef.current?.blur();
  }, [router]);

  function submitSearch(e) {
    e.preventDefault();
    // If a suggestion is highlighted via keyboard, go there instead of raw query
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      router.push(`/${suggestions[activeIndex].slug}`);
      saveRecentSearch(query.trim());
      setQuery('');
      setSuggestions([]);
      setSearchFocused(false);
      setActiveIndex(-1);
      document.documentElement.classList.remove('searching');
      return;
    }
    goToSearch(query);
  }

  function handleKeyDown(e) {
    const total = showSuggestions ? suggestions.length : 0;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (total > 0) setActiveIndex((i) => (i + 1) % total);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (total > 0) setActiveIndex((i) => (i <= 0 ? total - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setSearchFocused(false);
      searchInputRef.current?.blur();
    }
  }

  // Scroll active suggestion into view when navigating via keyboard
  useEffect(() => {
    if (activeIndex >= 0) {
      suggestionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const trimmedQuery = query.trim();
  const showSuggestions = searchFocused && trimmedQuery.length >= 2;
  const showRecent = searchFocused && trimmedQuery.length === 0 && recentSearches.length > 0;

  return (
    <>
      <div id="mn2" className={mobileOpen ? 'open' : ''} onClick={(e) => e.target.id === 'mn2' && setMobileOpen(false)}>
        <div id="mnp">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {mobileLinks.map((link) => (
              <Link key={link.href} className="mna" href={link.href}>{link.label}</Link>
            ))}
          </div>
        </div>
      </div>

      <header id="hdr">
        <div className="hi">
          <Link className="logo" href="/" aria-label="EverydayOnAI Home">
            <div className="li logo-img">
              <Image src="/icon-512.png" alt="" width={34} height={34} priority />
            </div>
            <span className="ln">EverydayOn<em>AI</em></span>
          </Link>

          <nav className="mn" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`na ${isActive(pathname, link.href) ? 'act' : ''}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hr">
            <div className="header-search-wrap">
              <form
                className={`srch ${searchFocused ? 'is-open' : ''}`}
                onSubmit={submitSearch}
                role="search"
                onClick={() => searchInputRef.current?.focus()}
              >
                <Search size={12} strokeWidth={2.5} />
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    setSearchFocused(true);
                    document.documentElement.classList.add('searching');
                  }}
                  onBlur={() => {
                    // If user is mid-click on a suggestion, don't close the panel —
                    // this is what previously caused suggestions to vanish before
                    // the click/navigation could register.
                    if (clickingSuggestionRef.current) return;
                    setTimeout(() => setSearchFocused(false), 160);
                    setTimeout(() => document.documentElement.classList.remove('searching'), 170);
                  }}
                  aria-label="Search articles"
                  aria-autocomplete="list"
                  aria-expanded={showSuggestions || showRecent}
                  placeholder="Search articles..."
                  autoComplete="off"
                  style={{ background: 'transparent', border: 0, outline: 0, color: 'inherit', width: '100%', font: 'inherit' }}
                />
              </form>

              {(showSuggestions || showRecent) && (
                <div
                  className="header-search-suggestions"
                  // Prevents input's onBlur from firing before the click on a
                  // suggestion has a chance to register as a navigation.
                  onMouseDown={() => { clickingSuggestionRef.current = true; }}
                  onMouseUp={() => { clickingSuggestionRef.current = false; }}
                >
                  {showRecent ? (
                    <>
                      <div className="header-search-suggestions-head">
                        <span>Recent searches</span>
                      </div>
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          className="header-search-suggestion header-search-recent"
                          onClick={() => goToSearch(term)}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Clock size={12} style={{ flexShrink: 0, opacity: .6 }} />
                            {term}
                          </span>
                          <ArrowUpRight size={12} />
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="header-search-suggestions-head">
                        <span>Suggestions</span>
                        {suggesting && <Loader2 size={13} className="animate-spin" />}
                      </div>
                      {suggestions.length > 0 ? suggestions.map((post, i) => (
                        <Link
                          key={post.id}
                          ref={(el) => { suggestionRefs.current[i] = el; }}
                          href={`/${post.slug}`}
                          className={`header-search-suggestion ${i === activeIndex ? 'is-active' : ''}`}
                          onMouseEnter={() => setActiveIndex(i)}
                          onClick={() => saveRecentSearch(trimmedQuery)}
                        >
                          <span><HighlightMatch text={post.title} query={trimmedQuery} /></span>
                          <ArrowUpRight size={12} />
                        </Link>
                      )) : (
                        <div className="header-search-empty">
                          {suggesting ? 'Searching...' : `No matches for "${trimmedQuery}" — press Enter to search anyway.`}
                        </div>
                      )}
                      {suggestions.length > 0 && (
                        <button
                          type="button"
                          className="header-search-viewall"
                          onClick={() => goToSearch(trimmedQuery)}
                        >
                          View all results for &ldquo;{trimmedQuery}&rdquo;
                          <ArrowUpRight size={12} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <button className="ib" onClick={toggleTheme} aria-label="Toggle dark mode">
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <Link className="bs" href="/subscribe">Subscribe</Link>

            <button className="mob-btn ib" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={16} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

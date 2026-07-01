'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, Moon, Sun, ArrowUpRight } from 'lucide-react';
import { loadSearchIndex, searchLocalPosts } from '@/lib/searchIndexClient';

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

function isActive(pathname, href) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [indexLoading, setIndexLoading] = useState(false);

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
    const term = query.trim();

    if (!searchFocused || term.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIndexLoading(true);
      try {
        const posts = await loadSearchIndex();
        setSuggestions(searchLocalPosts(posts, term, { limit: 5, titleOnly: true }));
      } catch {
        setSuggestions([]);
      } finally {
        setIndexLoading(false);
      }
    }, 90);

    return () => {
      clearTimeout(timer);
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

  function submitSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setQuery('');
    setSuggestions([]);
    setSearchFocused(false);
    document.documentElement.classList.remove('searching');
  }

  const showSuggestions = searchFocused && query.trim().length >= 2;

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
              <form className="srch" onSubmit={submitSearch} role="search">
                <Search size={12} strokeWidth={2.5} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    setSearchFocused(true);
                    document.documentElement.classList.add('searching');
                  }}
                  onBlur={() => {
                    setTimeout(() => setSearchFocused(false), 160);
                    setTimeout(() => document.documentElement.classList.remove('searching'), 170);
                  }}
                  aria-label="Search articles"
                  placeholder="Search articles..."
                  style={{ background: 'transparent', border: 0, outline: 0, color: 'inherit', width: '100%', font: 'inherit' }}
                />
              </form>
              {showSuggestions && (
                <div className="header-search-suggestions">
                  <div className="header-search-suggestions-head">
                    <span>Suggestions</span>
                    {indexLoading && <span>Loading</span>}
                  </div>
                  {suggestions.length > 0 ? suggestions.map((post) => (
                    <Link key={post.id} href={`/${post.slug}`} className="header-search-suggestion">
                      <span>{post.title}</span>
                      <ArrowUpRight size={12} />
                    </Link>
                  )) : (
                    <div className="header-search-empty">{indexLoading ? 'Loading article index...' : 'Press Enter to search.'}</div>
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

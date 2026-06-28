'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, CornerDownRight, Menu, Search, X, Zap } from 'lucide-react';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import { NAV_LINKS } from '@/config/site';

function NavItem({ link, wpCategories }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const pathname = usePathname();

  const wpCat = wpCategories?.find((c) => c.slug === link.slug);
  const children = wpCat?.children?.nodes?.filter((c) => (c.count ?? 0) > 0) ?? [];
  const isActive = pathname === link.href || (link.slug && pathname.startsWith(`/category/${link.slug}`));

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const base = 'px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-150 border-none bg-transparent font-[inherit] cursor-pointer';
  const active = 'text-[var(--c1)] bg-[rgba(41,53,129,.08)]';
  const inactive = 'text-[var(--ts)] hover:text-[var(--c1)] hover:bg-[rgba(41,53,129,.07)]';

  if (!children.length) {
    return (
      <Link href={link.href} className={`${base} ${isActive ? active : inactive}`}>
        {link.label}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-haspopup="true"
        className={`${base} ${isActive ? active : inactive} flex items-center gap-1.5`}>
        {link.label}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div role="menu" className="absolute top-full left-0 mt-2 w-56 rounded-xl py-2 z-50"
          style={{
            background: 'var(--sur)',
            border: '1px solid var(--bdr)',
            boxShadow: '0 16px 40px rgba(41,53,129,.14), 0 4px 8px rgba(41,53,129,.08)',
          }}>
          <Link href={link.href} role="menuitem" onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm font-bold transition-colors"
            style={{ color: 'var(--c2)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(66,116,217,.07)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            All {link.label}
          </Link>
          <div className="mx-3 my-1" style={{ height: '1px', background: 'var(--bdr)' }} />
          {children.map((child) => (
            <Link key={child.slug} href={`/category/${child.slug}`} role="menuitem" onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-2 text-sm transition-colors"
              style={{ color: 'var(--ts)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--c2)'; e.currentTarget.style.background = 'rgba(66,116,217,.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--ts)'; e.currentTarget.style.background = 'transparent'; }}>
              <span>{child.name}</span>
              {child.count > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ color: 'var(--tm)', background: 'var(--bg3)' }}>
                  {child.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wpCategories, setWpCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => Array.isArray(d) && setWpCategories(d)).catch(() => {});
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (q) { router.push(`/search?q=${encodeURIComponent(q)}`); setSearchOpen(false); setSearchQuery(''); }
  };

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,.94)' : 'rgba(255,255,255,.9)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--bdr)',
        boxShadow: scrolled ? '0 1px 12px rgba(41,53,129,.09)' : '0 1px 4px rgba(41,53,129,.04)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="EverydayOnAI Home">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg,var(--c1),var(--c2))', boxShadow: '0 4px 12px rgba(41,53,129,.3)' }}>
              <Zap size={17} className="text-white fill-white" />
            </div>
            <span className="font-extrabold text-[17px] tracking-tight" style={{ color: 'var(--c1)', letterSpacing: '-.02em' }}>
              EverydayOn<em style={{ fontStyle: 'normal', color: 'var(--c2)' }}>AI</em>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {NAV_LINKS.map(link => <NavItem key={link.href} link={link} wpCategories={wpCategories} />)}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: 'var(--bg3)', border: '1px solid var(--bdr)', boxShadow: '0 0 0 3px rgba(66,116,217,.1)' }}>
                <Search size={13} style={{ color: 'var(--tm)', flexShrink: 0 }} />
                <input autoFocus type="search" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSearch(); if (e.key === 'Escape') setSearchOpen(false); }}
                  placeholder="Search articles..."
                  aria-label="Search articles"
                  className="bg-transparent text-sm outline-none w-44"
                  style={{ color: 'var(--tp)', fontFamily: 'inherit' }}
                />
                <button onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <X size={13} style={{ color: 'var(--tm)' }} />
                </button>
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} aria-label="Search"
                className="p-2 rounded-lg transition-all"
                style={{ color: 'var(--tm)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--c2)'; e.currentTarget.style.background = 'rgba(66,116,217,.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--tm)'; e.currentTarget.style.background = 'transparent'; }}>
                <Search size={18} />
              </button>
            )}

            <DarkModeToggle />

            <Link href="/subscribe"
              className="hidden sm:inline-flex items-center gap-1.5 text-white text-sm font-bold px-4 py-2 rounded-[20px] transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,var(--c1),var(--c2))', boxShadow: '0 3px 10px rgba(41,53,129,.28)' }}>
              Subscribe
            </Link>

            <button onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--ts)' }}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav aria-label="Mobile navigation" className="lg:hidden px-4 py-3 max-h-[80vh] overflow-y-auto"
          style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bdr)' }}>
          {NAV_LINKS.map(link => {
            const wpCat = wpCategories?.find(c => c.slug === link.slug);
            const children = wpCat?.children?.nodes?.filter(c => (c.count ?? 0) > 0) ?? [];
            return (
              <div key={link.href}>
                <Link href={link.href}
                  className="block px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                  style={{ color: 'var(--ts)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--c2)'; e.currentTarget.style.background = 'rgba(66,116,217,.07)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--ts)'; e.currentTarget.style.background = 'transparent'; }}>
                  {link.label}
                </Link>
                {children.map(child => (
                  <Link key={child.slug} href={`/category/${child.slug}`}
                    className="block px-6 py-2 text-sm rounded-lg transition-colors"
                    style={{ color: 'var(--tm)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--c2)'; e.currentTarget.style.background = 'rgba(66,116,217,.07)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--tm)'; e.currentTarget.style.background = 'transparent'; }}>
                    <CornerDownRight size={11} style={{color:"var(--tm)",marginRight:"4px",flexShrink:0}} />{child.name}
                  </Link>
                ))}
              </div>
            );
          })}
          <Link href="/subscribe"
            className="mt-3 block text-center text-white text-sm font-bold px-4 py-2.5 rounded-xl"
            style={{ background: 'linear-gradient(135deg,var(--c1),var(--c2))' }}>
            Subscribe Free
          </Link>
        </nav>
      )}
    </header>
  );
}

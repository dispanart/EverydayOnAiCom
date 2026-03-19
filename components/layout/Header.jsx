'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu, X, Zap, ChevronDown } from 'lucide-react';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import { NAV_LINKS } from '@/config/site';

// ─── DROPDOWN NAV ITEM ────────────────────────────────────────────────────
function NavItem({ link, wpCategories }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const pathname = usePathname();

  // Find matching WP category to get live subcategories
  const wpCat = wpCategories?.find((c) => c.slug === link.slug);
  const children = wpCat?.children?.nodes?.filter((c) => (c.count ?? 0) > 0) ?? [];

  const isActive =
    pathname === link.href ||
    (link.slug && pathname.startsWith(`/category/${link.slug}`));

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const baseClass =
    'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150';
  const activeClass = 'text-blue-600 bg-blue-50';
  const inactiveClass = 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70';

  // No children → plain link
  if (!children.length) {
    return (
      <Link
        href={link.href}
        className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
      >
        {link.label}
      </Link>
    );
  }

  // Has subcategories → dropdown
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`${baseClass} ${isActive ? activeClass : inactiveClass}
          flex items-center gap-1.5 cursor-pointer`}
      >
        {link.label}
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-xl
                     shadow-xl shadow-slate-200/70 border border-slate-100
                     py-2 z-50"
        >
          {/* "View all" link */}
          <Link
            href={link.href}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm font-semibold text-blue-600
                       hover:bg-blue-50 transition-colors"
          >
            All {link.label}
          </Link>
          <div className="mx-3 my-1 h-px bg-slate-100" />

          {/* Subcategories */}
          {children.map((child) => (
            <Link
              key={child.slug}
              href={`/category/${child.slug}`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-2 text-sm
                         text-slate-600 hover:text-blue-600 hover:bg-blue-50
                         transition-colors"
            >
              <span>{child.name}</span>
              {child.count > 0 && (
                <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
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

// ─── MAIN HEADER ─────────────────────────────────────────────────────────
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wpCategories, setWpCategories] = useState([]);
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Fetch live WP categories for dropdown subcategories
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setWpCategories(data))
      .catch(() => {}); // gracefully degrade to static nav
  }, []);

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="EverydayOnAI Home">
            <Image 
  src="/nama-logo-kamu.webp" 
  alt="EverydayOnAI Logo" 
  width={32} 
  height={32}
  className="rounded-lg"
/>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              EverydayOn<span className="text-blue-600">AI</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <NavItem key={link.href} link={link} wpCategories={wpCategories} />
            ))}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">

            {/* Search */}
            {searchOpen ? (
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl
                             px-3 py-1.5 bg-slate-50 shadow-sm">
                <Search size={14} className="text-slate-400 flex-shrink-0" />
                <input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                  placeholder="Search articles..."
                  aria-label="Search articles"
                  className="bg-transparent text-sm text-slate-800 outline-none w-44
                             placeholder:text-slate-400"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                >
                  <X size={14} className="text-slate-400 hover:text-slate-600 transition-colors" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                aria-label="Open search"
              >
                <Search size={18} />
              </button>
            )}

            {/* Dark mode toggle */}
            <DarkModeToggle />

            {/* Subscribe CTA */}
            <Link
              href="/subscribe"
              className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700
                         text-white text-sm font-semibold px-4 py-2 rounded-lg
                         transition-all hover:shadow-md hover:shadow-blue-200/60
                         hover:-translate-y-0.5"
            >
              Subscribe
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden bg-white border-t border-slate-100 px-4 py-3
                     max-h-[80vh] overflow-y-auto"
        >
          {NAV_LINKS.map((link) => {
            const wpCat = wpCategories?.find((c) => c.slug === link.slug);
            const children = wpCat?.children?.nodes?.filter((c) => (c.count ?? 0) > 0) ?? [];

            return (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="block px-3 py-2.5 text-sm font-semibold text-slate-700
                             hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
                {children.map((child) => (
                  <Link
                    key={child.slug}
                    href={`/category/${child.slug}`}
                    className="block px-6 py-2 text-sm text-slate-500
                               hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    ↳ {child.name}
                  </Link>
                ))}
              </div>
            );
          })}
          <Link
            href="/subscribe"
            className="mt-3 block text-center bg-blue-600 hover:bg-blue-700
                       text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            Subscribe Free
          </Link>
        </nav>
      )}
    </header>
  );
}

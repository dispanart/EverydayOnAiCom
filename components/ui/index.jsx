/**
 * components/ui/index.jsx — Shared UI primitives
 * Redesigned to match everydayonai-final.html aesthetic
 */

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, RefreshCw, Star } from 'lucide-react';
import { getDisplayDate, formatShortDate, stripHtmlAndDecode } from '@/lib/wordpress';

// ── DATE META ──────────────────────────────────────────────────────────────
export function DateMeta({ post, className = '' }) {
  const { date, isUpdated } = getDisplayDate(post);
  return (
    <span className={`text-xs flex items-center gap-1 ${isUpdated ? 'font-medium' : ''} ${className}`}
      style={{ color: isUpdated ? '#22c55e' : 'var(--tm)' }}>
      {isUpdated ? <RefreshCw size={10} /> : <Calendar size={10} />}
      {isUpdated ? `Updated ${formatShortDate(date)}` : formatShortDate(date)}
    </span>
  );
}

// ── CATEGORY BADGE ─────────────────────────────────────────────────────────
export function CategoryBadge({ name, slug, className = '' }) {
  if (!name) return null;
  const content = (
    <span className={`chip chip-royal ${className}`}>{name}</span>
  );
  return slug
    ? <Link href={`/category/${slug}`}>{content}</Link>
    : content;
}

// ── BADGE NEW (< 7 days) ───────────────────────────────────────────────────
export function NewBadge({ post }) {
  const { date } = getDisplayDate(post);
  const isNew = (Date.now() - new Date(date).getTime()) < 7 * 24 * 60 * 60 * 1000;
  if (!isNew) return null;
  return <span className="badge-new">New</span>;
}

// ── STANDARD POST CARD ─────────────────────────────────────────────────────
export function PostCard({ post }) {
  const img = post.featuredImage?.node;
  const category = post.categories?.nodes?.[0];

  return (
    <Link href={`/${post.slug}`}
      className="group block rounded-[15px] overflow-hidden card-hover"
      style={{ background: 'var(--sur)', border: '1px solid var(--bdr)', boxShadow: 'var(--sh-sm)' }}>
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: 'var(--bg3)' }}>
        {img?.sourceUrl ? (
          <Image src={img.sourceUrl} alt={img.altText || post.title} fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 300px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,var(--bg3),var(--bdr))' }}>
            <span className="font-black text-3xl select-none" style={{ color: 'rgba(41,53,129,.1)' }}>AI</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {category && <span className="chip chip-blue">{category.name}</span>}
          <NewBadge post={post} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2 transition-colors group-hover:text-[var(--c2)]"
          style={{ color: 'var(--tp)' }}>
          {post.title}
        </h3>
        <DateMeta post={post} />
      </div>
    </Link>
  );
}

// ── RATED CARD ─────────────────────────────────────────────────────────────
export function RatedCard({ post }) {
  const img = post.featuredImage?.node;
  const category = post.categories?.nodes?.[0];
  const excerpt = stripHtmlAndDecode(post.excerpt).slice(0, 110);
  const rating = post.acf?.rating || null;

  return (
    <Link href={`/${post.slug}`}
      className="group block rounded-[15px] overflow-hidden card-hover"
      style={{ background: 'var(--sur)', border: '1px solid var(--bdr)', boxShadow: 'var(--sh-sm)' }}>
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: 'var(--bg3)' }}>
        {img?.sourceUrl ? (
          <Image src={img.sourceUrl} alt={img.altText || post.title} fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 400px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,var(--bg3),var(--bdr))' }} />
        )}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {category && <span className="chip chip-teal">{category.name}</span>}
          <NewBadge post={post} />
        </div>
        {rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ background: 'rgba(245,158,11,.9)', color: 'white', fontSize: '10.5px', fontWeight: 800 }}>
            <Star size={10} className="fill-white" />{rating}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold leading-snug mb-2 line-clamp-2 transition-colors group-hover:text-[var(--c2)]"
          style={{ color: 'var(--tp)' }}>
          {post.title}
        </h3>
        {excerpt && <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--tm)' }}>{excerpt}...</p>}
        <div className="flex items-center justify-between">
          <DateMeta post={post} />
          <span className="text-xs font-bold" style={{ color: 'var(--c2)' }}>Read review</span>
        </div>
      </div>
    </Link>
  );
}

// ── MASONRY CARD ───────────────────────────────────────────────────────────
const GRADIENTS = [
  'from-[#1a2a6c] to-[#2a5ac8]',
  'from-[#134e4a] to-[#065f46]',
  'from-[#1e1040] to-[#3b1f7a]',
  'from-[#7c2d12] to-[#9a3412]',
];

export function MasonryCard({ post, tall = false, index = 0 }) {
  const img = post.featuredImage?.node;
  const category = post.categories?.nodes?.[0];

  return (
    <Link href={`/${post.slug}`}
      className={`group relative block rounded-2xl overflow-hidden card-hover ${tall ? 'row-span-2' : ''}`}
      style={{ minHeight: tall ? '340px' : '160px' }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}`}>
        {img?.sourceUrl && (
          <Image src={img.sourceUrl} alt={img.altText || post.title} fill
            sizes="(max-width:640px) 50vw, 300px"
            className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-70 transition-all duration-300"
          />
        )}
      </div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,.78) 0%,rgba(0,0,0,.18) 60%,transparent 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {category && <span className="chip chip-teal">{category.name}</span>}
          <NewBadge post={post} />
        </div>
        <h3 className="font-bold text-sm leading-snug line-clamp-2 text-white transition-colors group-hover:text-[var(--c3)]">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

// ── HORIZONTAL CARD ────────────────────────────────────────────────────────
export function HorizontalCard({ post }) {
  const img = post.featuredImage?.node;
  const category = post.categories?.nodes?.[0];

  return (
    <Link href={`/${post.slug}`}
      className="group flex gap-4 items-start p-4 rounded-[14px] transition-all hover:-translate-y-[3px] hover:shadow-[var(--sh-hv)] hover:border-[rgba(66,116,217,.3)]"
      style={{ background: 'var(--sur)', border: '1px solid var(--bdr)', boxShadow: 'var(--sh-sm)' }}>
      <div className="relative w-28 h-20 flex-shrink-0 rounded-xl overflow-hidden" style={{ background: 'var(--bg3)' }}>
        {img?.sourceUrl ? (
          <Image src={img.sourceUrl} alt={img.altText || post.title} fill sizes="112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,var(--bg3),var(--bdr))' }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          {category && <span className="chip chip-blue">{category.name}</span>}
          <NewBadge post={post} />
        </div>
        <h3 className="font-bold text-sm leading-snug mt-0.5 mb-1 line-clamp-2 transition-colors group-hover:text-[var(--c2)]"
          style={{ color: 'var(--tp)' }}>
          {post.title}
        </h3>
        <DateMeta post={post} />
      </div>
    </Link>
  );
}

// ── AD SLOT ────────────────────────────────────────────────────────────────
const AD_SIZES = {
  leaderboard: { width: '728px', height: '90px', label: '728×90 Leaderboard' },
  'in-feed':   { width: '100%',  height: '80px', label: 'Native In-Feed Ad' },
  square:      { width: '300px', height: '250px', label: '300×250 Rectangle' },
};

export function AdSlot({ type = 'leaderboard', className = '' }) {
  const size = AD_SIZES[type] ?? AD_SIZES.leaderboard;
  return (
    <div className={`ad-slot ${className}`}
      style={{ width: size.width, height: size.height, maxWidth: '100%' }}
      aria-label={`Advertisement — ${size.label}`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
      Ad · {size.label}
    </div>
  );
}

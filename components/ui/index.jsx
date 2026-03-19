/**
 * ─────────────────────────────────────────────────────────────────
 *  components/ui/index.jsx — Shared UI primitives
 *  Import from here: import { PostCard, DateMeta, AdSlot } from '@/components/ui'
 * ─────────────────────────────────────────────────────────────────
 */

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, RefreshCw, Star } from 'lucide-react';
import { getDisplayDate, formatShortDate, stripHtmlAndDecode } from '@/lib/wordpress';

// ─── DATE META ───────────────────────────────────────────────────────────────

/**
 * Displays either "Updated [date]" (green) or "[date]" based on modification time.
 */
export function DateMeta({ post, className = '' }) {
  const { date, isUpdated } = getDisplayDate(post);
  return (
    <span
      className={`text-xs flex items-center gap-1 ${
        isUpdated ? 'text-green-600 font-medium' : 'text-slate-400'
      } ${className}`}
    >
      {isUpdated ? <RefreshCw size={10} /> : <Calendar size={10} />}
      {isUpdated ? `Updated ${formatShortDate(date)}` : formatShortDate(date)}
    </span>
  );
}

// ─── CATEGORY BADGE ──────────────────────────────────────────────────────────

export function CategoryBadge({ name, slug, className = '' }) {
  if (!name) return null;
  const content = (
    <span
      className={`inline-flex items-center px-2.5 py-1 bg-blue-600 text-white
                  text-xs font-bold uppercase tracking-wider rounded-full
                  ${className}`}
    >
      {name}
    </span>
  );
  return slug ? (
    <Link href={`/category/${slug}`} onClick={(e) => e.stopPropagation()}>
      {content}
    </Link>
  ) : (
    content
  );
}

// ─── STANDARD POST CARD ───────────────────────────────────────────────────────

export function PostCard({ post }) {
  const img = post.featuredImage?.node;
  const category = post.categories?.nodes?.[0];

  return (
    <Link
      href={`/${post.slug}`}
      className="group block bg-white rounded-2xl border border-slate-100
                 overflow-hidden card-hover"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
        {img?.sourceUrl ? (
          <Image
            src={img.sourceUrl}
            alt={img.altText || post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100
                         flex items-center justify-center">
            <span className="text-blue-200 font-black text-3xl select-none">AI</span>
          </div>
        )}
        {category && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs
                          font-bold px-2.5 py-1 rounded-full">
            {category.name}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 line-clamp-2
                       group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <DateMeta post={post} />
      </div>
    </Link>
  );
}

// ─── RATED CARD (for AI Tools silo) ─────────────────────────────────────────

export function RatedCard({ post }) {
  const img = post.featuredImage?.node;
  const category = post.categories?.nodes?.[0];
  const excerpt = stripHtmlAndDecode(post.excerpt).slice(0, 110);
  // TODO: Replace with ACF field `post.acf?.rating` when available
  const rating = post.acf?.rating || null;

  return (
    <Link
      href={`/${post.slug}`}
      className="group block bg-white rounded-2xl border border-slate-100
                 overflow-hidden card-hover"
    >
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
        {img?.sourceUrl ? (
          <Image
            src={img.sourceUrl}
            alt={img.altText || post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-50 to-blue-50" />
        )}
        {category && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs
                          font-bold px-2.5 py-1 rounded-full">
            {category.name}
          </span>
        )}
        {rating && (
          <div className="absolute top-3 right-3 bg-amber-400 text-white text-xs
                         font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star size={10} className="fill-white" />
            {rating}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-slate-900 leading-snug mb-2 line-clamp-2
                       group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        {excerpt && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-3">
            {excerpt}...
          </p>
        )}
        <div className="flex items-center justify-between">
          <DateMeta post={post} />
          <span className="text-xs font-semibold text-blue-600">Read review →</span>
        </div>
      </div>
    </Link>
  );
}

// ─── MASONRY CARD (for Creativity silo) ──────────────────────────────────────

const MASONRY_GRADIENTS = [
  'from-blue-800 to-blue-500',
  'from-teal-700 to-emerald-400',
  'from-violet-800 to-purple-500',
  'from-amber-700 to-orange-400',
];

export function MasonryCard({ post, tall = false, index = 0 }) {
  const img = post.featuredImage?.node;
  const category = post.categories?.nodes?.[0];
  const gradient = MASONRY_GRADIENTS[index % MASONRY_GRADIENTS.length];

  return (
    <Link
      href={`/${post.slug}`}
      className={`group relative block rounded-2xl overflow-hidden card-hover
                  ${tall ? 'row-span-2' : ''}`}
      style={{ minHeight: tall ? '340px' : '160px' }}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
        {img?.sourceUrl && (
          <Image
            src={img.sourceUrl}
            alt={img.altText || post.title}
            fill
            sizes="(max-width: 640px) 50vw, 300px"
            className="object-cover opacity-60 group-hover:scale-105
                       group-hover:opacity-70 transition-all duration-300"
          />
        )}
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {category && (
          <span className="inline-block bg-blue-600 text-white text-xs font-bold
                          px-2.5 py-0.5 rounded-full mb-2">
            {category.name}
          </span>
        )}
        <h3 className="font-bold text-white text-sm leading-snug line-clamp-2
                       group-hover:text-blue-200 transition-colors">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

// ─── HORIZONTAL CARD (for Lifestyle silo) ────────────────────────────────────

export function HorizontalCard({ post }) {
  const img = post.featuredImage?.node;
  const category = post.categories?.nodes?.[0];

  return (
    <Link
      href={`/${post.slug}`}
      className="group flex gap-4 items-start bg-white rounded-2xl border border-slate-100
                 p-4 card-hover"
    >
      {/* Thumbnail */}
      <div className="relative w-28 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
        {img?.sourceUrl ? (
          <Image
            src={img.sourceUrl}
            alt={img.altText || post.title}
            fill
            sizes="112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100" />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        {category && (
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            {category.name}
          </span>
        )}
        <h3 className="font-bold text-slate-900 text-sm leading-snug mt-0.5 mb-1 line-clamp-2
                       group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <DateMeta post={post} />
      </div>
    </Link>
  );
}

// ─── AD SLOT ────────────────────────────────────────────────────────────────

const AD_SIZES = {
  leaderboard: { width: '728px', height: '90px', label: '728×90 Leaderboard' },
  'in-feed':   { width: '100%',  height: '80px', label: 'Native In-Feed Ad' },
  square:      { width: '300px', height: '250px', label: '300×250 Rectangle' },
};

/**
 * AdSense placeholder — replace inner comment with real <ins> tag after approval.
 * @param {'leaderboard'|'in-feed'|'square'} type
 */
export function AdSlot({ type = 'leaderboard', className = '' }) {
  const size = AD_SIZES[type] ?? AD_SIZES.leaderboard;

  return (
    <div
      className={`flex items-center justify-center mx-auto border-2 border-dashed
                  border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-xs
                  font-medium tracking-widest uppercase ${className}`}
      style={{ width: size.width, height: size.height, maxWidth: '100%' }}
      aria-label={`Advertisement — ${size.label}`}
    >
      {/*
        Replace this content with your AdSense code:
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true" />
      */}
      Ad · {size.label}
    </div>
  );
}

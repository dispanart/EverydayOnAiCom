/**
 * CategorySilo — renders a homepage content section with title, "View All" link,
 * and a grid of posts in one of four layouts.
 *
 * Layouts:
 *   grid-4          — 4-column card grid (Business AI)
 *   grid-3-rated    — 3-column rated cards with score badge (AI Tools)
 *   masonry         — Masonry-style overlay cards (Creativity)
 *   horizontal-2col — 2-column horizontal cards (Lifestyle)
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  PostCard,
  RatedCard,
  MasonryCard,
  HorizontalCard,
} from '@/components/ui';

export default function CategorySilo({ title, viewAllHref, posts, layout }) {
  if (!posts?.length) return null;

  return (
    <section className="mb-14" aria-labelledby={`silo-${layout}`}>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          id={`silo-${layout}`}
          className="flex items-center gap-3 text-xl font-extrabold text-slate-900 tracking-tight"
        >
          <span className="w-1 h-7 bg-blue-600 rounded-full block" aria-hidden="true" />
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-sm font-semibold text-blue-600
                     hover:text-blue-800 transition-colors"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      {/* ── Layout: 4-column grid ── */}
      {layout === 'grid-4' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {posts.slice(0, 4).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* ── Layout: 3-column rated ── */}
      {layout === 'grid-3-rated' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <RatedCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* ── Layout: masonry ── */}
      {layout === 'masonry' && (
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          style={{ gridAutoRows: '160px' }}
        >
          {posts.slice(0, 4).map((post, i) => (
            <MasonryCard
              key={post.id}
              post={post}
              tall={i === 0 || i === 3}
              index={i}
            />
          ))}
        </div>
      )}

      {/* ── Layout: 2-column horizontal ── */}
      {layout === 'horizontal-2col' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.slice(0, 4).map((post) => (
            <HorizontalCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

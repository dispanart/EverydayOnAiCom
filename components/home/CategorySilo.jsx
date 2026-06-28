import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PostCard, RatedCard, MasonryCard, HorizontalCard } from '@/components/ui';

export default function CategorySilo({ title, viewAllHref, posts, layout }) {
  if (!posts?.length) return null;

  return (
    <section className="mb-14" aria-labelledby={`silo-${layout}`}>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 id={`silo-${layout}`} className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight"
          style={{ color: 'var(--tp)' }}>
          <span className="section-bar" aria-hidden="true" />
          {title}
        </h2>
        <Link href={viewAllHref}
          className="flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg transition-all"
          style={{ color: 'var(--c2)', border: '1px solid rgba(66,116,217,.2)', background: 'rgba(66,116,217,.05)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(66,116,217,.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(66,116,217,.05)'; }}>
          View All <ArrowRight size={13} />
        </Link>
      </div>

      {layout === 'grid-4' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {posts.slice(0, 4).map(p => <PostCard key={p.id} post={p} />)}
        </div>
      )}

      {layout === 'grid-3-rated' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map(p => <RatedCard key={p.id} post={p} />)}
        </div>
      )}

      {layout === 'masonry' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ gridAutoRows: '160px' }}>
          {posts.slice(0, 4).map((p, i) => <MasonryCard key={p.id} post={p} tall={i === 0 || i === 3} index={i} />)}
        </div>
      )}

      {layout === 'horizontal-2col' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.slice(0, 4).map(p => <HorizontalCard key={p.id} post={p} />)}
        </div>
      )}
    </section>
  );
}

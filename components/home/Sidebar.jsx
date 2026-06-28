import Link from 'next/link';
import { TrendingUp, Eye } from 'lucide-react';
import { AdSlot } from '@/components/ui';
import { getDisplayDate, formatShortDate } from '@/lib/wordpress';

export default function Sidebar({ recentPosts = [] }) {
  return (
    <aside className="hidden xl:block w-72 flex-shrink-0 space-y-6" aria-label="Sidebar">

      {/* Ad slot top */}
      <div className="sticky top-24">
        <AdSlot type="square" />
      </div>

      {/* Trending widget */}
      <div className="rounded-2xl p-5 sticky top-[316px]"
        style={{ background: 'var(--sur)', border: '1px solid var(--bdr)', boxShadow: 'var(--sh-sm)' }}>
        <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.1em] mb-5"
          style={{ color: 'var(--c2)' }}>
          <TrendingUp size={13} style={{ color: 'var(--c2)' }} />
          Trending Now
        </h3>

        <ol className="space-y-0">
          {recentPosts.map((post, i) => {
            const { date, isUpdated } = getDisplayDate(post);
            return (
              <li key={post.id} style={{ borderBottom: i < recentPosts.length - 1 ? '1px solid var(--bdr)' : 'none', paddingBottom: i < recentPosts.length - 1 ? '12px' : 0, marginBottom: i < recentPosts.length - 1 ? '12px' : 0 }}>
                <Link href={`/${post.slug}`} className="group flex items-start gap-3">
                  <span className="text-2xl font-black leading-none min-w-[26px] transition-colors select-none"
                    style={{ color: 'rgba(66,116,217,.18)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(66,116,217,.45)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(66,116,217,.18)'}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-bold leading-snug line-clamp-2 mb-1 transition-colors group-hover:text-[var(--c2)]"
                      style={{ color: 'var(--tp)' }}>
                      {post.title}
                    </p>
                    <span className="text-xs flex items-center gap-1" style={{ color: isUpdated ? '#22c55e' : 'var(--tm)' }}>
                      <Eye size={10} />
                      {isUpdated ? `Updated ${formatShortDate(date)}` : formatShortDate(date)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Second ad slot */}
      <div className="sticky top-[640px]">
        <AdSlot type="square" />
      </div>
    </aside>
  );
}

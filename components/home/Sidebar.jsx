import Link from 'next/link';
import { TrendingUp, Calendar } from 'lucide-react';
import { AdSlot } from '@/components/ui';
import { getDisplayDate, formatShortDate } from '@/lib/wordpress';

export default function Sidebar({ recentPosts = [] }) {
  return (
    <aside className="hidden xl:block w-72 flex-shrink-0 space-y-8" aria-label="Sidebar">

      {/* Trending widget */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900
                      uppercase tracking-wider mb-5">
          <TrendingUp size={15} className="text-blue-600" />
          Trending Now
        </h3>

        <ol className="space-y-4">
          {recentPosts.map((post, i) => {
            const { date, isUpdated } = getDisplayDate(post);
            return (
              <li key={post.id}>
                <Link href={`/${post.slug}`} className="group flex items-start gap-3">
                  <span className="text-2xl font-black text-slate-100 leading-none
                                  min-w-[24px] group-hover:text-blue-100 transition-colors
                                  select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2
                                 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </p>
                    <span className={`text-xs flex items-center gap-1 mt-1 ${
                      isUpdated ? 'text-green-600' : 'text-slate-400'
                    }`}>
                      <Calendar size={10} />
                      {isUpdated ? 'Updated ' : ''}{formatShortDate(date)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Ad slot */}
      <div className="sticky top-[340px]">
        <AdSlot type="square" />
      </div>
    </aside>
  );
}

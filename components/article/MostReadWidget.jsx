import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { getRecentPosts } from '@/lib/wordpress';

export default async function MostReadWidget({ excludeSlug }) {
  const posts = (await getRecentPosts(6)).filter(p => p.slug !== excludeSlug).slice(0, 5);
  if (!posts.length) return null;

  return (
    <div className="rounded-2xl p-[18px]" style={{ background: 'var(--sur)', border: '1px solid var(--bdr)', boxShadow: 'var(--sh-sm)' }}>
      <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[.1em] mb-3.5"
        style={{ color: 'var(--c2)' }}>
        <TrendingUp size={11} /> Most Read
      </div>
      <ol className="space-y-0">
        {posts.map((post, i) => (
          <li key={post.id}
            style={{
              borderBottom: i < posts.length - 1 ? '1px solid var(--bdr)' : 'none',
              paddingBottom: i < posts.length - 1 ? '9px' : 0,
              marginBottom: i < posts.length - 1 ? '9px' : 0,
            }}>
            <Link href={`/${post.slug}`} className="group flex items-start gap-2.5">
              <span className="text-lg font-black leading-none min-w-[22px] select-none transition-colors group-hover:text-[rgba(66,116,217,.45)]"
                style={{ color: 'rgba(66,116,217,.18)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-[12.5px] font-bold leading-[1.4] transition-colors group-hover:text-[var(--c2)]"
                style={{ color: 'var(--tp)' }}>
                {post.title}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

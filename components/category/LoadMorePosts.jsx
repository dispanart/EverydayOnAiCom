'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, RefreshCw, Calendar, ChevronDown } from 'lucide-react';

function stripHtml(html) { return html?.replace(/<[^>]*>/g, '') ?? ''; }

export default function LoadMorePosts({ initialPosts, categorySlug }) {
  const [posts, setPosts]   = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 12);
  const [cursor, setCursor]   = useState(initialPosts[initialPosts.length - 1]?.id ?? null);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res  = await fetch(`/api/posts?category=${categorySlug}&after=${cursor}&first=12`);
      const data = await res.json();
      const newPosts = data.posts ?? [];
      if (newPosts.length < 12) setHasMore(false);
      if (newPosts.length > 0) { setPosts(p => [...p, ...newPosts]); setCursor(newPosts[newPosts.length - 1]?.id); }
      else setHasMore(false);
    } catch { setHasMore(false); } finally { setLoading(false); }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map(post => {
          const img = post.featuredImage?.node;
          const isNew = (Date.now() - new Date(post.date).getTime()) < 7 * 24 * 60 * 60 * 1000;
          const isUpdated = post.modifiedGmt && (new Date(post.modifiedGmt) - new Date(post.date)) > 3600000;
          const category = post.categories?.nodes?.[0];
          return (
            <Link key={post.id} href={`/${post.slug}`}
              className="group block rounded-[15px] overflow-hidden card-hover"
              style={{ background: 'var(--sur)', border: '1px solid var(--bdr)', boxShadow: 'var(--sh-sm)' }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: 'var(--bg3)' }}>
                {img?.sourceUrl ? (
                  <Image src={img.sourceUrl} alt={img.altText || post.title} fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 400px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEFEiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aq9c1ha5rnuVt5UbdFk2yQyNFjOSOiSFuuFKlFSlfJJP3oii0Wq1DP//Z"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,var(--bg3),var(--bdr))' }}>
                    <span className="font-black text-3xl select-none" style={{ color: 'rgba(41,53,129,.1)' }}>AI</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                  {category && <span className="chip chip-blue">{category.name}</span>}
                  {isNew && <span className="badge-new">New</span>}
                </div>
              </div>
              <div className="p-5">
                <h2 className="font-bold leading-snug mb-2 line-clamp-2 transition-colors group-hover:text-[var(--c2)]"
                  style={{ color: 'var(--tp)' }}>
                  {post.title}
                </h2>
                <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--tm)' }}>
                  {stripHtml(post.excerpt).slice(0, 120)}...
                </p>
                <span className={`text-xs flex items-center gap-1 ${isUpdated ? 'font-medium' : ''}`}
                  style={{ color: isUpdated ? '#22c55e' : 'var(--tm)' }}>
                  {isUpdated ? <RefreshCw size={10} /> : <Calendar size={10} />}
                  {isUpdated ? 'Updated ' : ''}
                  {new Date(post.modifiedGmt || post.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-10">
          <button onClick={loadMore} disabled={loading}
            className="flex items-center gap-2.5 font-bold px-8 py-3 rounded-full transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: 'var(--sur)', border: '2px solid var(--bdr)', color: 'var(--ts)', boxShadow: 'var(--sh-sm)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c2)'; e.currentTarget.style.color = 'var(--c2)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bdr)'; e.currentTarget.style.color = 'var(--ts)'; }}>
            {loading ? <><Loader2 size={16} className="animate-spin" />Loading...</> : <><ChevronDown size={16} />Load More</>}
          </button>
        </div>
      )}

      {!hasMore && posts.length > 12 && (
        <p className="text-center text-sm mt-10" style={{ color: 'var(--tm)' }}>
          All {posts.length} articles shown.
        </p>
      )}
    </>
  );
}

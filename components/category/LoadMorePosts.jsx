'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, RefreshCw, Calendar, ChevronDown } from 'lucide-react';

function timeDisplay(date, isUpdated) {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Use full decode version instead
function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, '') ?? '';
}

export default function LoadMorePosts({ initialPosts, categorySlug }) {
  const [posts, setPosts]     = useState(initialPosts);
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
      if (newPosts.length > 0) {
        setPosts((p) => [...p, ...newPosts]);
        setCursor(newPosts[newPosts.length - 1]?.id);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const img = post.featuredImage?.node;
          const date = post.modifiedGmt || post.date;
          const isUpdated = post.modifiedGmt &&
            (new Date(post.modifiedGmt) - new Date(post.date)) > 3600000;

          return (
            <Link key={post.id} href={`/${post.slug}`}
                  className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover">
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                {img?.sourceUrl ? (
                  <Image
                    src={img.sourceUrl}
                    alt={img.altText || post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEFEiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aq9c1ha5rnuVt5UbdFk2yQyNFjOSOiSFuuFKlFSlfJJP3oii0Wq1DP//Z"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                    <span className="text-blue-200 font-black text-3xl select-none">AI</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-bold text-slate-900 leading-snug mb-2 line-clamp-2
                              group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-500 text-sm line-clamp-2 mb-3">
                  {stripHtml(post.excerpt).slice(0, 120)}...
                </p>
                <span className={`text-xs flex items-center gap-1 ${isUpdated ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                  {isUpdated ? <RefreshCw size={10} /> : <Calendar size={10} />}
                  {isUpdated ? 'Updated ' : ''}{timeDisplay(date)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMore}
            disabled={loading}
            className="flex items-center gap-2.5 bg-white border-2 border-slate-200
                       hover:border-blue-400 hover:text-blue-600 text-slate-600
                       font-semibold px-8 py-3 rounded-full transition-all
                       hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" />Loading...</>
              : <><ChevronDown size={16} />Muat Lebih Banyak</>
            }
          </button>
        </div>
      )}

      {!hasMore && posts.length > 12 && (
        <p className="text-center text-sm text-slate-400 mt-10">
          Semua artikel sudah ditampilkan ({posts.length} artikel)
        </p>
      )}
    </>
  );
}

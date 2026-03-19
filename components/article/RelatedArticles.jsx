import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getPostsByCategory, getDisplayDate, formatShortDate } from '@/lib/wordpress';

export default async function RelatedArticles({ currentSlug, categorySlug, categoryName }) {
  if (!categorySlug) return null;

  const posts = await getPostsByCategory(categorySlug, 6);
  // Exclude current article
  const related = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  if (!related.length) return null;

  return (
    <section className="mt-14 pt-10 border-t border-slate-100" aria-label="Artikel terkait">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-600 rounded-full block" aria-hidden="true" />
          Artikel Terkait
        </h2>
        {categorySlug && (
          <Link href={`/category/${categorySlug}`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
            Lihat Semua <ArrowRight size={14} />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {related.map((post) => {
          const { date, isUpdated } = getDisplayDate(post);
          const img = post.featuredImage?.node;

          return (
            <Link key={post.id} href={`/${post.slug}`}
                  className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                {img?.sourceUrl ? (
                  <Image
                    src={img.sourceUrl}
                    alt={img.altText || post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEFEiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aq9c1ha5rnuVt5UbdFk2yQyNFjOSOiSFuuFKlFSlfJJP3oii0Wq1DP//Z"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                    <span className="text-blue-200 font-black text-2xl select-none">AI</span>
                  </div>
                )}
              </div>
              {/* Body */}
              <div className="p-4">
                <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 line-clamp-2
                               group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <span className={`text-xs flex items-center gap-1 ${isUpdated ? 'text-green-600' : 'text-slate-400'}`}>
                  {isUpdated ? '↻ Updated ' : ''}{formatShortDate(date)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

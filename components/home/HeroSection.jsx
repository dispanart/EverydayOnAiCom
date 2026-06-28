import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { stripHtmlAndDecode } from '@/lib/wordpress';
import { DateMeta } from '@/components/ui';

export default function HeroSection({ post }) {
  if (!post) return null;

  const category = post.categories?.nodes?.[0];
  const img = post.featuredImage?.node;
  const excerpt = stripHtmlAndDecode(post.excerpt).slice(0, 180);

  return (
    <section
      className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40
                 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
                 border-b border-slate-100 dark:border-slate-800"
      aria-label="Featured article"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text */}
          <div className="order-2 lg:order-1">
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/40
                           text-blue-700 dark:text-blue-400
                           text-xs font-bold uppercase tracking-widest rounded-full mb-4
                           hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
              >
                {category.name}
              </Link>
            )}

            {/* Title — blue in dark mode so it's readable on dark background */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold
                           text-slate-900 dark:text-blue-400
                           leading-tight tracking-tight mb-5">
              {post.title}
            </h1>

            {excerpt && (
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-6">
                {excerpt}
              </p>
            )}

            <div className="flex items-center gap-4 mb-8">
              {post.author?.node?.name && (
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  By {post.author.node.name}
                </span>
              )}
              <DateMeta post={post} className="text-sm" />
            </div>

            <Link
              href={`/${post.slug}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                         text-white font-bold px-6 py-3 rounded-xl transition-all
                         hover:shadow-lg hover:shadow-blue-200/60 hover:-translate-y-0.5"
            >
              Read Full Article <ArrowRight size={16} />
            </Link>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            {img?.sourceUrl ? (
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden
                             shadow-2xl shadow-slate-200/80 dark:shadow-slate-900/80
                             ring-1 ring-slate-200/50 dark:ring-slate-700/50">
                <Image
                  src={img.sourceUrl}
                  alt={img.altText || post.title}
                  fill priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200
                             dark:from-slate-800 dark:to-slate-700
                             flex items-center justify-center shadow-xl">
                <span className="text-blue-400 text-8xl font-black opacity-20 select-none">AI</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

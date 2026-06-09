import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { SITE } from '@/config/site';
import {
  getPostBySlug,
  getAllPostSlugs,
  getDisplayDate,
  formatDisplayDate,
  stripHtml,
} from '@/lib/wordpress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ReadingProgressBar } from '@/components/article/ReadingProgressBar';
import ShareBar from '@/components/article/ShareBar';
import LikeButton from '@/components/article/LikeButton';
import BookmarkButton from '@/components/article/BookmarkButton';
import CommentsSection from '@/components/article/CommentsSection';
import RelatedArticles from '@/components/article/RelatedArticles';
import TableOfContents from '@/components/article/TableOfContents';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import PrintButton from '@/components/ui/PrintButton';
import FontSizeAdjuster from '@/components/ui/FontSizeAdjuster';
import PushNotifButton from '@/components/ui/PushNotifButton';
import ArticleAdSlots from '@/components/article/ArticleAdSlots';

// ─── Helper ───────────────────────────────────────────────────────────────────
function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}
// ─────────────────────────────────────────────────────────────────────────────

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Not Found' };

  const description = stripHtml(post.excerpt).slice(0, 160);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://everydayonai.com';
  const featuredImg = post.featuredImage?.node?.sourceUrl;
  const catName = post.categories?.nodes?.[0]?.name || '';
  const ogImage = featuredImg
    || `${siteUrl}/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(catName)}`;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modifiedGmt,
      authors: post.author?.node?.name ? [post.author.node.name] : [],
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${siteUrl}/${params.slug}`,
    },
  };
}

function readingTime(content) {
  const words = content?.replace(/<[^>]*>/g, '').split(/\s+/).length ?? 0;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function PostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const { date: displayDate, isUpdated } = getDisplayDate(post);
  const dateStr = formatDisplayDate(displayDate);
  const categories = post.categories?.nodes ?? [];
  const primaryCategory = categories[0];
  const tags = post.tags?.nodes ?? [];
  const img = post.featuredImage?.node;
  const author = post.author?.node;
  const mins = readingTime(post.content);
  const canonicalUrl = `${SITE.url}/${post.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: stripHtml(post.excerpt).slice(0, 160),
    image: img?.sourceUrl ? [img.sourceUrl] : [],
    datePublished: post.date,
    dateModified: post.modifiedGmt || post.date,
    author: { '@type': 'Person', name: author?.name ?? SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  return (
    <>
      <Header />
      <ReadingProgressBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex gap-10">

            {/* ── Main content ── */}
            <article className="flex-1 min-w-0 max-w-3xl">

              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-8 flex-wrap">
                <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                {primaryCategory && (
                  <>
                    <span>/</span>
                    <Link href={`/category/${primaryCategory.slug}`} className="hover:text-blue-600 transition-colors">
                      {primaryCategory.name}
                    </Link>
                  </>
                )}
                <span>/</span>
                <span className="text-slate-600 line-clamp-1">{post.title}</span>
              </nav>

              {/* Category badge */}
              {primaryCategory && (
                <Link href={`/category/${primaryCategory.slug}`}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700
                                 text-xs font-bold uppercase tracking-widest rounded-full mb-4
                                 hover:bg-blue-200 transition-colors">
                  {primaryCategory.name}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
                {decodeHtmlEntities(post.title)}
              </h1>

              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-4 py-5 mb-6 border-t border-b border-slate-100">
                {/* Author */}
                <div className="flex items-center gap-2.5">
                  {author?.avatar?.url ? (
                    <Image src={author.avatar.url} alt={author.name} width={36} height={36}
                           className="rounded-full ring-2 ring-slate-100" unoptimized />
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={15} className="text-blue-600" />
                    </span>
                  )}
                  <div>
                    {author?.slug ? (
                      <Link href={`/author/${author.slug}`}
                            className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors leading-none">
                        {author.name ?? 'Editorial Team'}
                      </Link>
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 leading-none">
                        {author?.name ?? 'Editorial Team'}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">Author</p>
                  </div>
                </div>

                <div className="w-px h-8 bg-slate-200 hidden sm:block" />

                {/* Date */}
                <div className={`flex items-center gap-1.5 text-sm ${isUpdated ? 'text-green-600 font-semibold' : 'text-slate-500'}`}>
                  <Calendar size={14} />
                  {isUpdated ? `Updated ${dateStr}` : dateStr}
                </div>

                <div className="w-px h-8 bg-slate-200 hidden sm:block" />

                {/* Reading time */}
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Clock size={14} />
                  {mins} min read
                </div>

                {/* Bookmark — push to right on desktop */}
                <div className="ml-auto">
                  <ErrorBoundary fallbackMessage="Bookmark tidak tersedia">
                    <BookmarkButton slug={post.slug} title={post.title} />
                  </ErrorBoundary>
                </div>
              </div>

              {/* Featured image with blur placeholder */}
              {img?.sourceUrl && (
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg shadow-slate-200/60">
                  <Image
                    src={img.sourceUrl}
                    alt={img.altText || post.title}
                    fill priority
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEFEiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aq9c1ha5rnuVt5UbdFk2yQyNFjOSOiSFuuFKlFSlfJJP3oii0Wq1DP//Z"
                  />
                </div>
              )}

              {/* Article content — TOC auto-generates from this */}
              <ArticleAdSlots html={post.content} />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <div className="flex items-center flex-wrap gap-2">
                    <Tag size={14} className="text-slate-400" />
                    {tags.map((tag) => (
                      <Link key={tag.slug} href={`/tag/${tag.slug}`}
                            className="px-3 py-1 bg-slate-100 hover:bg-blue-100 text-slate-600
                                       hover:text-blue-700 text-xs font-medium rounded-full transition-colors">
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Toolbar: Print, Font size, Push notif */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <PrintButton />
                <FontSizeAdjuster />
                <PushNotifButton />
              </div>

              {/* Like + Share row */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4">
                <ErrorBoundary fallbackMessage="Like tidak tersedia">
                  <LikeButton slug={post.slug} />
                </ErrorBoundary>
                <ShareBar url={canonicalUrl} title={post.title} />
              </div>

              {/* Back link */}
              <div className="mt-8">
                <Link href={primaryCategory ? `/category/${primaryCategory.slug}` : '/'}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  <ArrowLeft size={14} />
                  Back to {primaryCategory?.name ?? 'Home'}
                </Link>
              </div>

              {/* Related Articles */}
              <ErrorBoundary fallbackMessage="Artikel terkait tidak tersedia">
                <RelatedArticles
                  currentSlug={post.slug}
                  categorySlug={primaryCategory?.slug}
                  categoryName={primaryCategory?.name}
                />
              </ErrorBoundary>

              {/* Comments */}
              <ErrorBoundary fallbackMessage="Comments are not available at this time">
                <CommentsSection slug={post.slug} />
              </ErrorBoundary>

            </article>

            {/* ── Sidebar (desktop only) ── */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Table of Contents */}
                <ErrorBoundary fallbackMessage="">
                  <TableOfContents content={post.content} />
                </ErrorBoundary>

                {/* Ad slot */}
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Advertisement</p>
                  <div className="bg-slate-100 rounded-xl h-60 flex items-center justify-center">
                    <span className="text-slate-300 text-xs">AD · 300×250</span>
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

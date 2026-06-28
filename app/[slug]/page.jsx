import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { SITE } from '@/config/site';
import {
  getPostBySlug, getAllPostSlugs, getDisplayDate,
  formatDisplayDate, stripHtml,
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

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

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
  const ogImage = featuredImg || `${siteUrl}/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(catName)}`;
  return {
    title: post.title, description,
    openGraph: { title: post.title, description, type: 'article', publishedTime: post.date, modifiedTime: post.modifiedGmt, authors: post.author?.node?.name ? [post.author.node.name] : [], images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: post.title, description, images: [ogImage] },
    alternates: { canonical: `${siteUrl}/${params.slug}` },
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
    '@context': 'https://schema.org', '@type': 'Article',
    headline: post.title, description: stripHtml(post.excerpt).slice(0, 160),
    image: img?.sourceUrl ? [img.sourceUrl] : [],
    datePublished: post.date, dateModified: post.modifiedGmt || post.date,
    author: { '@type': 'Person', name: author?.name ?? SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  return (
    <>
      <Header />
      <ReadingProgressBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex gap-10">

            {/* ── Main article ── */}
            <article className="flex-1 min-w-0 max-w-3xl">

              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-8 flex-wrap"
                style={{ color: 'var(--tm)' }}>
                <Link href="/" className="transition-colors hover:text-[var(--c2)]">Home</Link>
                {primaryCategory && (
                  <>
                    <span style={{ color: 'var(--bdr)' }}>/</span>
                    <Link href={`/category/${primaryCategory.slug}`} className="transition-colors hover:text-[var(--c2)]">
                      {primaryCategory.name}
                    </Link>
                  </>
                )}
                <span style={{ color: 'var(--bdr)' }}>/</span>
                <span className="line-clamp-1" style={{ color: 'var(--ts)' }}>{post.title}</span>
              </nav>

              {/* Category badge */}
              {primaryCategory && (
                <Link href={`/category/${primaryCategory.slug}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 transition-colors chip chip-royal">
                  {primaryCategory.name}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mb-6"
                style={{ color: 'var(--tp)', letterSpacing: '-.02em' }}>
                {decodeHtmlEntities(post.title)}
              </h1>

              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-4 py-5 mb-6"
                style={{ borderTop: '1px solid var(--bdr)', borderBottom: '1px solid var(--bdr)' }}>
                <div className="flex items-center gap-2.5">
                  <Link href="/about/dispa" className="flex-shrink-0">
                    <Image
                      src="/authors/dispa-ai-buff-author-photo.webp"
                      alt="Dispa — The AI Buff"
                      width={36} height={36}
                      className="rounded-full transition-all"
                      style={{ border: '2px solid var(--c3)' }}
                    />
                  </Link>
                  <div>
                    <Link href="/about/dispa"
                      className="text-sm font-semibold transition-colors hover:text-[var(--c2)] leading-none"
                      style={{ color: 'var(--tp)' }}>
                      {author?.name ?? 'Dispa — The AI Buff'}
                    </Link>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--tm)' }}>Author</p>
                  </div>
                </div>

                <div className="w-px h-8 hidden sm:block" style={{ background: 'var(--bdr)' }} />

                <div className={`flex items-center gap-1.5 text-sm ${isUpdated ? 'font-semibold' : ''}`}
                  style={{ color: isUpdated ? '#22c55e' : 'var(--ts)' }}>
                  <Calendar size={14} />
                  {isUpdated ? `Updated ${dateStr}` : dateStr}
                </div>

                <div className="w-px h-8 hidden sm:block" style={{ background: 'var(--bdr)' }} />

                <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--ts)' }}>
                  <Clock size={14} />{mins} min read
                </div>

                <div className="ml-auto">
                  <ErrorBoundary fallbackMessage="">
                    <BookmarkButton slug={post.slug} title={post.title} />
                  </ErrorBoundary>
                </div>
              </div>

              {/* Featured image */}
              {img?.sourceUrl && (
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-0"
                  style={{ boxShadow: '0 8px 32px rgba(41,53,129,.14)' }}>
                  <Image
                    src={img.sourceUrl} alt={img.altText || post.title}
                    fill priority sizes="(max-width:768px) 100vw, 768px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEFEiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aq9c1ha5rnuVt5UbdFk2yQyNFjOSOiSFuuFKlFSlfJJP3oii0Wq1DP//Z"
                  />
                </div>
              )}

              {/* Ad slot 1 — after featured image */}
              <div className="my-8">
                <p className="text-xs font-bold uppercase tracking-widest text-center mb-2" style={{ color: 'var(--tm)' }}>Advertisement</p>
                <div className="ad-slot" style={{ height: '90px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                  </svg>
                  Ad · 728×90
                </div>
              </div>

              {/* Article content with inline ads */}
              <ArticleAdSlots html={post.content} />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-10 pt-8" style={{ borderTop: '1px solid var(--bdr)' }}>
                  <div className="flex items-center flex-wrap gap-2">
                    <Tag size={14} style={{ color: 'var(--tm)' }} />
                    {tags.map(tag => (
                      <Link key={tag.slug} href={`/tag/${tag.slug}`}
                        className="px-3 py-1 text-xs font-medium rounded-full transition-colors"
                        style={{ background: 'var(--bg3)', color: 'var(--ts)', border: '1px solid var(--bdr)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(66,116,217,.1)'; e.currentTarget.style.color = 'var(--c2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--ts)'; }}>
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Toolbar */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <PrintButton />
                <FontSizeAdjuster />
                <PushNotifButton />
              </div>

              {/* Like + Share */}
              <div className="mt-8 pt-6 flex flex-wrap items-center gap-4" style={{ borderTop: '1px solid var(--bdr)' }}>
                <ErrorBoundary fallbackMessage="">
                  <LikeButton slug={post.slug} />
                </ErrorBoundary>
                <ShareBar url={canonicalUrl} title={post.title} />
              </div>

              {/* Back link */}
              <div className="mt-8">
                <Link href={primaryCategory ? `/category/${primaryCategory.slug}` : '/'}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[var(--c2)]"
                  style={{ color: 'var(--c2)' }}>
                  <ArrowLeft size={14} />
                  Back to {primaryCategory?.name ?? 'Home'}
                </Link>
              </div>

              {/* Ad slot — before related */}
              <div className="my-10">
                <p className="text-xs font-bold uppercase tracking-widest text-center mb-2" style={{ color: 'var(--tm)' }}>Advertisement</p>
                <div className="ad-slot" style={{ height: '90px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                  </svg>
                  Ad · 728×90
                </div>
              </div>

              {/* Related articles */}
              <ErrorBoundary fallbackMessage="">
                <RelatedArticles
                  currentSlug={post.slug}
                  categorySlug={primaryCategory?.slug}
                  categoryName={primaryCategory?.name}
                />
              </ErrorBoundary>

              {/* Ad slot — after related, above footer */}
              <div className="mt-10">
                <p className="text-xs font-bold uppercase tracking-widest text-center mb-2" style={{ color: 'var(--tm)' }}>Advertisement</p>
                <div className="ad-slot" style={{ height: '90px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                  </svg>
                  Ad · 728×90
                </div>
              </div>

              {/* Comments */}
              <ErrorBoundary fallbackMessage="Comments are not available at this time.">
                <CommentsSection slug={post.slug} />
              </ErrorBoundary>

            </article>

            {/* ── Sidebar ── */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Table of Contents */}
                <ErrorBoundary fallbackMessage="">
                  <TableOfContents content={post.content} />
                </ErrorBoundary>

                {/* Sidebar ad */}
                <div className="rounded-2xl p-4 text-center" style={{ background: 'var(--sur)', border: '1px solid var(--bdr)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--tm)' }}>Advertisement</p>
                  <div className="rounded-xl flex items-center justify-center ad-slot" style={{ height: '250px' }}>
                    <span className="text-xs" style={{ color: 'var(--tm)' }}>Ad · 300×250</span>
                  </div>
                </div>

                {/* Second sidebar ad */}
                <div className="rounded-2xl p-4 text-center" style={{ background: 'var(--sur)', border: '1px solid var(--bdr)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--tm)' }}>Advertisement</p>
                  <div className="rounded-xl flex items-center justify-center ad-slot" style={{ height: '250px' }}>
                    <span className="text-xs" style={{ color: 'var(--tm)' }}>Ad · 300×250</span>
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

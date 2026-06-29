import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';
import { SITE } from '@/config/site';
import { getPostBySlug, getAllPostSlugs, getRecentPosts, getDisplayDate, formatDisplayDate, stripHtml, stripHtmlAndDecode } from '@/lib/wordpress';
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
import ArticleViews from '@/components/article/ArticleViews';

export const revalidate = 60;

export async function generateStaticParams() {
 const slugs = await getAllPostSlugs();
 return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
 const post = await getPostBySlug(params.slug);
 if (!post) return { title: 'Not Found' };
 const description = stripHtml(post.excerpt).slice(0, 160);
 const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;
 const featuredImg = post.featuredImage?.node?.sourceUrl;
 const catName = post.categories?.nodes?.[0]?.name || '';
 const ogImage = featuredImg || `${siteUrl}/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(catName)}`;
 return {
 title: stripHtmlAndDecode(post.title),
 description,
 openGraph: {
 title: stripHtmlAndDecode(post.title),
 description,
 type: 'article',
 publishedTime: post.date,
 modifiedTime: post.modifiedGmt,
 authors: post.author?.node?.name ? [post.author.node.name] : [],
 images: [{ url: ogImage, width: 1200, height: 630 }],
 },
 twitter: { card: 'summary_large_image', title: stripHtmlAndDecode(post.title), description, images: [ogImage] },
 alternates: { canonical: `${siteUrl}/${params.slug}` },
 };
}

function readingTime(content) {
 const words = content?.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length ?? 0;
 return Math.max(1, Math.ceil(words / 200));
}

export default async function PostPage({ params }) {
 const post = await getPostBySlug(params.slug);
 if (!post) notFound();

 const recentPosts = await getRecentPosts(200);
 const currentIndex = recentPosts.findIndex((item) => item.slug === post.slug);
 const nextArticle = currentIndex > 0 ? recentPosts[currentIndex - 1] : null;
 const previousArticle = currentIndex >= 0 ? recentPosts[currentIndex + 1] : null;

 const { date: displayDate, isUpdated } = getDisplayDate(post);
 const dateStr = formatDisplayDate(displayDate);
 const categories = post.categories?.nodes ?? [];
 const primaryCategory = categories[0];
 const tags = post.tags?.nodes ?? [];
 const img = post.featuredImage?.node;
 const author = post.author?.node;
 const authorImage = '/authors/dispa-ai-buff-author-photo.webp';
 const mins = readingTime(post.content);
 const canonicalUrl = `${SITE.url}/${post.slug}`;
 const title = stripHtmlAndDecode(post.title);

 const jsonLd = {
 '@context': 'https://schema.org',
 '@type': 'Article',
 headline: title,
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

 <main className="article-page">
 <div className="w sec article-shell">
 <div className="al">
 <article>
 <nav aria-label="Breadcrumb" className="abrC">
 <Link href="/">Home</Link>
 {primaryCategory && <><span>/</span><Link href={`/category/${primaryCategory.slug}`}>{primaryCategory.name}</Link></>}
 <span>/</span>
 <span className="line-clamp-1">{title}</span>
 </nav>

 {categories.length > 0 && (
 <div className="article-category-list">
 {categories.map((category) => (
 <Link key={category.slug} href={`/category/${category.slug}`} className="chip c2">{category.name}</Link>
 ))}
 </div>
 )}

 <h1 className="ah1">{title}</h1>

 {img?.sourceUrl && (
 <div className="afi article-featured-under-title">
 <Image
 src={img.sourceUrl}
 alt={img.altText || title}
 fill
 priority
 sizes="(max-width: 768px) 100vw, 850px"
 style={{ objectFit: 'cover' }}
 placeholder="blur"
 blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEFEiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aq9c1ha5rnuVt5UbdFk2yQyNFjOSOiSFuuFKlFSlfJJP3oii0Wq1DP//Z"
 />
 </div>
 )}

 <div className="abl article-byline">
 <div className="article-author-row">
 <Link href="/about/dispa" className="av author-photo" aria-label="Dispa - The AI Buff author profile">
 <Image src={authorImage} alt={author?.name || 'Dispa - The AI Buff'} width={32} height={32} style={{ objectFit: 'cover' }} />
 </Link>
 <div>
 <Link href="/about/dispa" style={{ color: 'var(--txt)', fontWeight: 700, textDecoration: 'none' }}>{author?.name ?? 'Dispa - The AI Buff'}</Link>
 <div style={{ fontSize: 11, color: 'var(--muted)' }}>Author</div>
 </div>
 </div>
 <div className="article-meta-row">
 <span><Calendar size={14} />{isUpdated ? `Updated ${dateStr}` : dateStr}</span>
 <span><Clock size={14} />{mins} min read</span>
 <ArticleViews postId={post.databaseId} />
 </div>
 </div>

 <div className="article-tools">
 <ErrorBoundary fallbackMessage="Like is unavailable"><LikeButton postId={post.databaseId} /></ErrorBoundary>
 <ErrorBoundary fallbackMessage="Bookmark is unavailable"><BookmarkButton slug={post.slug} title={title} /></ErrorBoundary>
 <ErrorBoundary fallbackMessage="Font size controls are unavailable"><FontSizeAdjuster /></ErrorBoundary>
 <ErrorBoundary fallbackMessage="Push notifications are unavailable"><PushNotifButton /></ErrorBoundary>
 </div>

 <div className="mobile-toc">
 <ErrorBoundary fallbackMessage=""><TableOfContents content={post.content} /></ErrorBoundary>
 </div>

 <ArticleAdSlots html={post.content} />

 <nav className="next-prev-articles article-next-prev-top" aria-label="Next and previous articles">
 {previousArticle ? (
 <Link href={`/${previousArticle.slug}`} className="next-prev-card">
 <span>Previous Article</span>
 <strong>{stripHtmlAndDecode(previousArticle.title)}</strong>
 </Link>
 ) : <span />}
 {nextArticle ? (
 <Link href={`/${nextArticle.slug}`} className="next-prev-card np-next">
 <span>Next Article</span>
 <strong>{stripHtmlAndDecode(nextArticle.title)}</strong>
 </Link>
 ) : <span />}
 </nav>

 <div className="article-after-actions">
 <ErrorBoundary fallbackMessage="Share is unavailable"><ShareBar title={title} url={canonicalUrl} postId={post.databaseId} /></ErrorBoundary>
 <ErrorBoundary fallbackMessage="Print is unavailable"><PrintButton /></ErrorBoundary>
 </div>

 {tags.length > 0 && (
 <div className="wid" style={{ marginTop: 32 }}>
 <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
 <Tag size={14} color="var(--muted)" />
 {tags.map((tag) => <Link key={tag.slug} href={`/tag/${tag.slug}`} className="chip c1">{tag.name}</Link>)}
 </div>
 </div>
 )}

 <ErrorBoundary fallbackMessage="Related articles are unavailable"><RelatedArticles currentSlug={post.slug} categorySlug={primaryCategory?.slug} categoryName={primaryCategory?.name} /></ErrorBoundary>
 <ErrorBoundary fallbackMessage="Comments are unavailable"><CommentsSection postId={post.databaseId} /></ErrorBoundary>
 </article>

 <aside className="sid hide-lg">
 <ErrorBoundary fallbackMessage=""><TableOfContents content={post.content} /></ErrorBoundary>
 </aside>
 </div>
 </div>
 </main>
 <Footer />
 </>
 );
}

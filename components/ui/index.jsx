import Link from 'next/link';
import Image from 'next/image';
import { Calendar, RefreshCw, Star } from 'lucide-react';
import { getDisplayDate, formatShortDate, stripHtmlAndDecode } from '@/lib/wordpress';

export function DateMeta({ post, className = '' }) {
 const { date, isUpdated } = getDisplayDate(post);
 return (
 <span className={`cm ${className}`}>
 {isUpdated ? <RefreshCw size={10} /> : <Calendar size={10} />}
 <span>{isUpdated ? `Updated ${formatShortDate(date)}` : formatShortDate(date)}</span>
 </span>
 );
}

export function CategoryBadge({ name, slug, className = '' }) {
 if (!name) return null;
 const badge = <span className={`chip c2 ${className}`}>{name}</span>;
 return slug ? <Link href={`/category/${slug}`}>{badge}</Link> : badge;
}

function ImageBlock({ post, sizes = '(max-width: 768px) 100vw, 400px' }) {
 const img = post.featuredImage?.node;
 return (
 <div className="ci">
 <div className="ci-ph">AI</div>
 {img?.sourceUrl && (
 <Image
 src={img.sourceUrl}
 alt={img.altText || stripHtmlAndDecode(post.title)}
 fill
 sizes={sizes}
 className="object-cover"
 />
 )}
 </div>
 );
}

export function PostCard({ post }) {
 const category = post.categories?.nodes?.[0];
 const title = stripHtmlAndDecode(post.title);
 const excerpt = stripHtmlAndDecode(post.excerpt || '').slice(0, 120);

 return (
 <Link href={`/${post.slug}`} className="card post-link-card">
 <ImageBlock post={post} />
 <div className="cb">
 <div className="ct">
 {category && <span className="chip c1">{category.name}</span>}
 </div>
 <h3 className="tt">{title}</h3>
 {excerpt && <p className="ex">{excerpt}...</p>}
 <div className="cm">
 <span>{formatShortDate(getDisplayDate(post).date)}</span>
 <span className="md" />
 <span>Read more</span>
 </div>
 </div>
 </Link>
 );
}

export function RatedCard({ post }) {
 const category = post.categories?.nodes?.[0];
 const title = stripHtmlAndDecode(post.title);
 const excerpt = stripHtmlAndDecode(post.excerpt || '').slice(0, 120);
 const rating = post.acf?.rating || '9.0';

 return (
 <Link href={`/${post.slug}`} className="card post-link-card">
 <ImageBlock post={post} />
 <div className="cb">
 <div className="ct">
 {category && <span className="chip c3">{category.name}</span>}
 <span className="tsc"><Star size={10} fill="currentColor" /> {rating}</span>
 </div>
 <h3 className="tt">{title}</h3>
 {excerpt && <p className="ex">{excerpt}...</p>}
 <div className="cm">
 <span>{formatShortDate(getDisplayDate(post).date)}</span>
 <span className="md" />
 <span>Tool review</span>
 </div>
 </div>
 </Link>
 );
}

export function MasonryCard({ post, tall = false, index = 0 }) {
 const img = post.featuredImage?.node;
 const category = post.categories?.nodes?.[0];
 const title = stripHtmlAndDecode(post.title);
 const gradients = [
 'linear-gradient(135deg,#1a2560,#4274d9)',
 'linear-gradient(135deg,#1e7a8c,#95ccd5)',
 'linear-gradient(135deg,#293581,#7c3aed)',
 'linear-gradient(135deg,#b45309,#f59e0b)',
 ];

 return (
 <Link
 href={`/${post.slug}`}
 className="card post-link-card"
 style={{ minHeight: tall ? 340 : 160, position: 'relative', gridRow: tall ? 'span 2' : undefined, background: gradients[index % gradients.length] }}
 >
 {img?.sourceUrl && (
 <Image src={img.sourceUrl} alt={img.altText || title} fill sizes="(max-width: 768px) 50vw, 300px" style={{ objectFit: 'cover', opacity: 0.55 }} />
 )}
 <div className="fo" />
 <div className="feat-body">
 {category && <span className="chip c3">{category.name}</span>}
 <h3 className="tt" style={{ color: '#fff', marginTop: 8 }}>{title}</h3>
 </div>
 </Link>
 );
}

export function HorizontalCard({ post }) {
 const img = post.featuredImage?.node;
 const category = post.categories?.nodes?.[0];
 const title = stripHtmlAndDecode(post.title);

 return (
 <Link href={`/${post.slug}`} className="card post-link-card" style={{ display: 'flex', gap: 14, padding: 12 }}>
 <div style={{ position: 'relative', width: 112, height: 80, flexShrink: 0, overflow: 'hidden', borderRadius: 12, background: 'var(--bg3)' }}>
 {img?.sourceUrl ? (
 <Image src={img.sourceUrl} alt={img.altText || title} fill sizes="112px" style={{ objectFit: 'cover' }} />
 ) : (
 <div className="ci-ph">AI</div>
 )}
 </div>
 <div style={{ minWidth: 0 }}>
 {category && <span className="chip c2">{category.name}</span>}
 <h3 className="tt" style={{ marginTop: 6 }}>{title}</h3>
 <DateMeta post={post} />
 </div>
 </Link>
 );
}

export function AdSlot() {
 return null;
}

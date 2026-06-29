import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Mail } from 'lucide-react';
import NeuralCanvas from '@/components/home/NeuralCanvas';
import { stripHtmlAndDecode, formatDisplayDate, getDisplayDate } from '@/lib/wordpress';

export default function HeroSection({ post }) {
 const category = post?.categories?.nodes?.[0];
 const img = post?.featuredImage?.node;
 const fallbackHeroImage = 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=75';
 const heroImageSrc = img?.sourceUrl || fallbackHeroImage;
 const title = post ? stripHtmlAndDecode(post.title) : 'The State of Generative AI: A Comprehensive Global Outlook';
 const excerpt = post ? stripHtmlAndDecode(post.excerpt).slice(0, 150) : 'Practical insights on AI tools, business strategy, creativity, and everyday use — curated for founders, marketers, and curious minds.';
 const href = post?.slug ? `/${post.slug}` : '/articles';
 const displayDate = post ? formatDisplayDate(getDisplayDate(post).date) : 'Updated Daily';

 return (
 <section className="hero">
 <NeuralCanvas id="neural" />
 <div className="hc">
 <div>
 <div className="hb"><div className="ld" />Updated Daily</div>
 <h1 className="h1">Stay Ahead of <em>AI</em>,<br />Every Single Day.</h1>
 <p className="hp">Practical insights on AI tools, business strategy, creativity, and everyday use — curated for founders, marketers, and curious minds.</p>
 <div className="hbtns">
 <Link className="bh1" href="/subscribe"><Mail size={13} strokeWidth={2.5} />Subscribe Free</Link>
 <Link className="bh2" href="/articles">Explore Articles <ArrowRight size={13} strokeWidth={2.5} /></Link>
 </div>
 <div className="hs">
 <div><div className="sv">50K+</div><div className="sl">Readers</div></div>
 <div className="sdv" />
 <div><div className="sv">500+</div><div className="sl">Articles</div></div>
 <div className="sdv" />
 <div><div className="sv">Weekly</div><div className="sl">Newsletter</div></div>
 </div>
 </div>

 <Link className="fc post-link-card" href={href} aria-label={title}>
 <div className="fi" style={{ background: 'linear-gradient(135deg,#1a2a6c,#2a5ac8)' }}>
 <Image
 src={heroImageSrc}
 alt={img?.altText || title}
 fill
 priority
 sizes="(max-width: 768px) 100vw, 560px"
 style={{ objectFit: 'cover' }}
 />
 <div className="fo" style={{ zIndex: 1 }} />
 <div className="feat-body">
 <span className="bn"> {category?.name || 'New'}</span>
 <div className="ft">{title}</div>
 {excerpt && <div className="fd">{displayDate} · {excerpt}</div>}
 </div>
 </div>
 </Link>
 </div>
 </section>
 );
}

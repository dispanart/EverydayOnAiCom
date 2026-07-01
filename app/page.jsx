import { SITE, CATEGORIES } from '@/config/site';
import { getFeaturedPost, getPostsByCategory, getRecentPosts } from '@/lib/wordpress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import Sidebar from '@/components/home/Sidebar';
import { PostCard } from '@/components/ui';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AdSense from '@/components/ui/AdSense';
import { AD_SLOTS } from '@/config/ads';

export const revalidate = 60;

export const metadata = {
 title: `${SITE.name} — ${SITE.tagline}`,
 description: SITE.description,
 openGraph: { title: SITE.name, description: SITE.tagline, url: SITE.url, siteName: SITE.name, type: 'website' },
};

const tools = [
 { rank: 1, name: 'ChatGPT', category: 'AI Assistant', href: 'https://chatgpt.com/', domain: 'chatgpt.com' },
 { rank: 2, name: 'Midjourney', category: 'Creative AI', href: 'https://www.midjourney.com/', domain: 'midjourney.com' },
 { rank: 3, name: 'NotebookLM', category: 'AI Research', href: 'https://notebooklm.google.com/', domain: 'notebooklm.google.com' },
 { rank: 4, name: 'Cursor', category: 'Vibe Coding', href: 'https://cursor.com/', domain: 'cursor.com' },
 { rank: 5, name: 'Perplexity', category: 'AI Search', href: 'https://www.perplexity.ai/', domain: 'perplexity.ai' },
];

function faviconUrl(domain) {
 const cleanDomain = String(domain || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
 return `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`;
}

function ToolsStrip() {
 return (
 <div className="sec">
 <div className="sh">
 <h2 className="st"><span className="sb" />Trending AI Tools This Week</h2>
 <Link className="va" href="/tools">All Tools <ArrowRight size={12} strokeWidth={2.5} /></Link>
 </div>
 <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18, marginTop: -10 }}>Most-used AI tools by professionals. Includes referral links.</p>
 <div className="g5">
 {tools.map((tool) => (
 <a key={tool.name} className="tc tc-logo" href={tool.href} target="_blank" rel="noopener noreferrer">
 <span className="trk">{tool.rank}</span>
 <div className="tlw"><img src={faviconUrl(tool.domain)} alt="" loading="lazy" width="48" height="48" /></div>
 <div className="tn">{tool.name}</div>
 <div className="tcat">{tool.category}</div>
 </a>
 ))}
 </div>
 </div>
 );
}

export default async function HomePage() {
 const categoryFetches = CATEGORIES.map((cat) => getPostsByCategory(cat.slug, cat.postCount));
 const [featuredPost, recentPosts, trendingPosts, ...categoryPosts] = await Promise.all([
 getFeaturedPost(),
 getRecentPosts(12),
 getRecentPosts(5, 604800),
 ...categoryFetches,
 ]);

 const flattened = [...recentPosts, ...categoryPosts.flat()];
 const seen = new Set();
 const latestPosts = flattened.filter((post) => {
 const key = post?.slug || post?.id;
 if (!key || seen.has(key)) return false;
 seen.add(key);
 return true;
 }).slice(0, 9);

 return (
 <>
 <Header />
 <main>
 <HeroSection post={featuredPost || latestPosts[0]} />

 <div className="w">
 <AdSense slot={AD_SLOTS.homeTop} className="eonai-ad-home-top" />
 <div className="sec">
 <div className="g2">
 <div>
 <div className="sh">
 <h2 className="st"><span className="sb" />Latest Articles</h2>
 <Link className="va" href="/articles">View All <ArrowRight size={12} strokeWidth={2.5} /></Link>
 </div>

 <div className="g3" style={{ marginBottom: 18 }}>
 {latestPosts.slice(0, 3).map((post) => <PostCard key={post.id || post.slug} post={post} />)}
 </div>

 <AdSense slot={AD_SLOTS.homeInFeed} className="eonai-ad-home-infeed" />

 <div className="g3" style={{ marginBottom: 18 }}>
 {latestPosts.slice(3, 6).map((post) => <PostCard key={post.id || post.slug} post={post} />)}
 </div>

 <div className="g3">
 {latestPosts.slice(6, 9).map((post) => <PostCard key={post.id || post.slug} post={post} />)}
 </div>
 <AdSense slot={AD_SLOTS.homeBottom} className="eonai-ad-home-bottom" />
 </div>

 <Sidebar recentPosts={recentPosts} trendingPosts={trendingPosts} />
 </div>
 </div>

 <div className="gd" />
 <ToolsStrip />
 </div>
 </main>
 <Footer />
 </>
 );
}

import { SITE, CATEGORIES } from '@/config/site';
import { getFeaturedPost, getPostsByCategory, getRecentPosts } from '@/lib/wordpress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import Sidebar from '@/components/home/Sidebar';
import { PostCard } from '@/components/ui';
import Link from 'next/link';
import { ArrowRight, Play, Search, Star } from 'lucide-react';
import AdSense from '@/components/ui/AdSense';
import { AD_SLOTS } from '@/config/ads';

export const revalidate = 60;

export const metadata = {
 title: `${SITE.name} — ${SITE.tagline}`,
 description: SITE.description,
 openGraph: { title: SITE.name, description: SITE.tagline, url: SITE.url, siteName: SITE.name, type: 'website' },
};

const tools = [
 { rank: 1, name: 'ChatGPT', category: 'AI Assistant', score: '9.5', href: 'https://chat.openai.com', bg: '#10a37f', icon: 'bolt' },
 { rank: 2, name: 'Midjourney', category: 'AI Image', score: '9.2', href: 'https://www.midjourney.com', bg: '#000', icon: 'image' },
 { rank: 3, name: 'Claude', category: 'AI Assistant', score: '9.1', href: 'https://claude.ai', bg: '#d97706', icon: 'chat' },
 { rank: 4, name: 'Perplexity', category: 'AI Search', score: '8.8', href: 'https://perplexity.ai', bg: '#1a1a2e', icon: 'search' },
 { rank: 5, name: 'Runway', category: 'AI Video', score: '8.6', href: 'https://www.runway.ml', bg: '#6d28d9', icon: 'play' },
];

function ToolIcon({ icon }) {
 if (icon === 'play') return <Play size={26} fill="white" color="white" />;
 if (icon === 'search') return <Search size={26} color="#20B2AA" />;
 return <span style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>AI</span>;
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
 <a key={tool.name} className="tc" href={tool.href} target="_blank" rel="noopener noreferrer">
 <span className="trk">{tool.rank}</span>
 <div className="tlw" style={{ background: tool.bg, borderRadius: 12, marginTop: 8 }}><ToolIcon icon={tool.icon} /></div>
 <div className="tn">{tool.name}</div>
 <div className="tcat">{tool.category}</div>
 <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><div className="tsc"><Star size={10} fill="currentColor" /> {tool.score}</div><span className="ref">REF</span></div>
 </a>
 ))}
 </div>
 </div>
 );
}

export default async function HomePage() {
 const categoryFetches = CATEGORIES.map((cat) => getPostsByCategory(cat.slug, cat.postCount));
 const [featuredPost, recentPosts, ...categoryPosts] = await Promise.all([
 getFeaturedPost(),
 getRecentPosts(12),
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

 <Sidebar recentPosts={recentPosts} />
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

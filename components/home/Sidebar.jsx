import Link from 'next/link';
import { TrendingUp, Mail } from 'lucide-react';
import { formatShortDate, getDisplayDate, stripHtmlAndDecode } from '@/lib/wordpress';
import AdSense from '@/components/ui/AdSense';
import { AD_SLOTS } from '@/config/ads';

export default async function Sidebar({ recentPosts = [], trendingPosts = [] }) {
 const posts = (trendingPosts.length ? trendingPosts : recentPosts).slice(0, 5);

 return (
 <aside className="sid" aria-label="Sidebar">
 <AdSense slot={AD_SLOTS.sidebarTop} className="eonai-ad-sidebar" />

 <div className="wid">
 <div className="wt"><TrendingUp size={11} strokeWidth={2.5} />Trending Topics</div>
 <div className="trending-list">
 {posts.map((post, i) => (
 <Link key={post.id || post.slug} href={`/${post.slug}`} className="tri post-link-card trending-card">
 <span className="trn trending-rank">{String(i + 1).padStart(2, '0')}</span>
 <div>
 <div className="hot-row"><span className="hot-badge">Hot</span><span>{formatShortDate(getDisplayDate(post).date)}</span></div>
 <div className="trt">{stripHtmlAndDecode(post.title)}</div>
 <div className="tri-info">Latest pick<span className="vd" />Trending</div>
 </div>
 </Link>
 ))}
 </div>
 </div>

 <div className="nlb">
 <div className="nlb-badge"><div className="nlb-dot" />Free Weekly</div>
 <h4>The AI Roundup</h4>
 <div className="nlb-sub">Top AI stories, tools & tips — every Friday morning. No spam, ever.</div>
 <div className="nlb-stats">
 <div className="nlb-stat"><div className="nlb-stat-v">50K+</div><div className="nlb-stat-l">Readers</div></div>
 <div className="nlb-divider" />
 <div className="nlb-stat"><div className="nlb-stat-v">Weekly</div><div className="nlb-stat-l">Every Friday</div></div>
 <div className="nlb-divider" />
 <div className="nlb-stat"><div className="nlb-stat-v">Free</div><div className="nlb-stat-l">Always</div></div>
 </div>
 <form action="/subscribe">
 <input className="nli" type="email" name="email" placeholder="your@email.com" />
 <button className="nlbtn" type="submit"><Mail size={14} />Subscribe Free</button>
 </form>
 <div className="nlb-disclaimer">No spam. Unsubscribe anytime.</div>
 </div>
 <AdSense slot={AD_SLOTS.sidebarBottom} className="eonai-ad-sidebar" />
 </aside>
 );
}

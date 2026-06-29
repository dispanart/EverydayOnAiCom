import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getRecentPosts } from '@/lib/wordpress';
import { PostCard } from '@/components/ui';
import { SITE } from '@/config/site';
import AdSense, { AD_SLOTS } from '@/components/ui/AdSense';

export const revalidate = 60;

export const metadata = {
 title: `All Articles — ${SITE.name}`,
 description: 'Explore the latest AI articles, guides, policy explainers, tool reviews, and practical insights from EverydayOnAI.',
};

export default async function ArticlesPage() {
 const posts = await getRecentPosts(24);
 return (
 <>
 <Header />
 <main>
 <div className="apg"><div className="w"><h1>All Articles</h1><p>Explore our complete library of AI insights, tool reviews, tutorials, and business strategies.</p></div></div>
 <div className="w">
 <AdSense slot={AD_SLOTS.articlesTop} className="eonai-ad-list-top" />
 <div className="fb-bar" id="fb-bar">
 <span className="fb on">All Topics</span>
 <span className="fb">AI for Business</span>
 <span className="fb">AI Tools</span>
 <span className="fb">Prompts</span>
 <span className="fb">Creativity</span>
 <span className="fb">Lifestyle</span>
 <span className="fb">Policy</span>
 </div>
 {posts.length ? (
 <div className="agrid">
 {posts.map((post) => <PostCard key={post.id || post.slug} post={post} />)}
 </div>
 ) : (
 <div className="wid" style={{ textAlign: 'center', padding: 40 }}>No articles found.</div>
 )}
 </div>
 </main>
 <Footer />
 </>
 );
}

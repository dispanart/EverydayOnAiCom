import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getRecentPosts } from '@/lib/wordpress';
import { SITE } from '@/config/site';
import AdSense from '@/components/ui/AdSense';
import { AD_SLOTS } from '@/config/ads';
import ArticlesFilter from '@/components/articles/ArticlesFilter';

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
 <ArticlesFilter posts={posts} />
 </div>
 </main>
 <Footer />
 </>
 );
}

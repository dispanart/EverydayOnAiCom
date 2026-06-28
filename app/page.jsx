import { SITE, CATEGORIES } from '@/config/site';
import {
  getFeaturedPost,
  getPostsByCategory,
  getRecentPosts,
} from '@/lib/wordpress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategorySilo from '@/components/home/CategorySilo';
import Sidebar from '@/components/home/Sidebar';
import { AdSlot } from '@/components/ui';

// ISR: revalidate page every 60 seconds
export const revalidate = 60;

export const metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.tagline,
    url: SITE.url,
    siteName: SITE.name,
    type: 'website',
  },
};

export default async function HomePage() {
  // Fetch all category posts + recent posts in parallel
  const [featuredPost, recentPosts, ...categoryPosts] = await Promise.all([
    getFeaturedPost(),
    getRecentPosts(5),
    ...CATEGORIES.map((cat) => getPostsByCategory(cat.slug, cat.postCount)),
  ]);

  const [businessPosts, toolsPosts, creativePosts, lifestylePosts] = categoryPosts;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">

        {/* Hero — Featured post */}
        <HeroSection post={featuredPost} />

        {/* Main content + Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-10">

            {/* ── Content silos ── */}
            <div className="flex-1 min-w-0">

              {/* Silo 1: AI for Business */}
              <CategorySilo
                title={CATEGORIES[0].label}
                viewAllHref={`/category/${CATEGORIES[0].slug}`}
                posts={businessPosts}
                layout={CATEGORIES[0].layout}
              />

              {/* Ad Slot 1: Leaderboard */}
              <div className="my-10 flex justify-center">
                <AdSlot type="leaderboard" />
              </div>

              {/* Silo 2: AI Tools Review & Comparison */}
              <CategorySilo
                title={CATEGORIES[1].label}
                viewAllHref={`/category/${CATEGORIES[1].slug}`}
                posts={toolsPosts}
                layout={CATEGORIES[1].layout}
              />

              {/* Silo 3: AI for Ideas & Creativity */}
              <CategorySilo
                title={CATEGORIES[2].label}
                viewAllHref={`/category/${CATEGORIES[2].slug}`}
                posts={creativePosts}
                layout={CATEGORIES[2].layout}
              />

              {/* Ad Slot 2: In-feed */}
              <div className="my-10">
                <AdSlot type="in-feed" />
              </div>

              {/* Silo 4: Everyday AI & Lifestyle */}
              <CategorySilo
                title={CATEGORIES[3].label}
                viewAllHref={`/category/${CATEGORIES[3].slug}`}
                posts={lifestylePosts}
                layout={CATEGORIES[3].layout}
              />
            </div>

            {/* ── Sidebar ── */}
            <Sidebar recentPosts={recentPosts} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

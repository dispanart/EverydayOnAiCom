import { SITE, CATEGORIES } from '@/config/site';
import { getFeaturedPost, getPostsByCategory, getRecentPosts } from '@/lib/wordpress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategorySilo from '@/components/home/CategorySilo';
import Sidebar from '@/components/home/Sidebar';
import TrendingTools from '@/components/home/TrendingTools';
import { AdSlot } from '@/components/ui';

export const revalidate = 60;

export const metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  openGraph: {
    title: SITE.name, description: SITE.tagline, url: SITE.url,
    siteName: SITE.name, type: 'website',
  },
};

export default async function HomePage() {
  const [featuredPost, recentPosts, ...categoryPosts] = await Promise.all([
    getFeaturedPost(),
    getRecentPosts(5),
    ...CATEGORIES.map(cat => getPostsByCategory(cat.slug, cat.postCount)),
  ]);

  const [businessPosts, toolsPosts, creativePosts, promptsPosts, lifestylePosts] = categoryPosts;

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg)' }}>

        {/* Hero */}
        <HeroSection post={featuredPost} />

        {/* Ad below hero */}
        <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--bdr)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <AdSlot type="leaderboard" />
          </div>
        </div>

        {/* Main content + sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-10">

            <div className="flex-1 min-w-0">

              {/* Glow divider before first section */}
              <div className="glow-divider mb-10" />

              {/* Silo 1 — AI for Business */}
              <CategorySilo
                title={CATEGORIES[0].label}
                viewAllHref={`/category/${CATEGORIES[0].slug}`}
                posts={businessPosts}
                layout={CATEGORIES[0].layout}
              />

              {/* Ad between silos */}
              <div className="my-10 flex justify-center">
                <AdSlot type="leaderboard" />
              </div>

              {/* Silo 2 — AI Tools Review */}
              <CategorySilo
                title={CATEGORIES[1].label}
                viewAllHref={`/category/${CATEGORIES[1].slug}`}
                posts={toolsPosts}
                layout={CATEGORIES[1].layout}
              />

              {/* Glow divider */}
              <div className="glow-divider my-10" />

              {/* Silo 3 — Creativity */}
              <CategorySilo
                title={CATEGORIES[2].label}
                viewAllHref={`/category/${CATEGORIES[2].slug}`}
                posts={creativePosts}
                layout={CATEGORIES[2].layout}
              />

              {/* Ad */}
              <div className="my-10">
                <AdSlot type="in-feed" />
              </div>

              {/* Silo 4 — Lifestyle */}
              <CategorySilo
                title={CATEGORIES[4].label}
                viewAllHref={`/category/${CATEGORIES[4].slug}`}
                posts={lifestylePosts}
                layout={CATEGORIES[4].layout}
              />

            </div>

            {/* Sidebar */}
            <Sidebar recentPosts={recentPosts} />
          </div>
        </div>

        {/* Trending AI Tools strip */}
        <div className="glow-divider" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <TrendingTools />
        </div>
      </main>

      {/* Ad above footer */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bdr)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <AdSlot type="leaderboard" />
        </div>
      </div>

      <Footer />
    </>
  );
}

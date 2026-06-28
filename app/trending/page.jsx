import Link from 'next/link';
import { TrendingUp, Heart, ArrowRight } from 'lucide-react';
import { SITE } from '@/config/site';
import { supabase } from '@/lib/supabase';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';

export const revalidate = 300;
export const metadata = {
  title: 'Trending',
  description: `Most popular articles on ${SITE.name}`,
};

async function getTrending() {
  const { data } = await supabase.from('likes').select('slug');
  if (!data) return [];
  const counts = {};
  data.forEach(({ slug }) => { counts[slug] = (counts[slug] || 0) + 1; });
  return Object.entries(counts)
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
}

export default async function TrendingPage() {
  const trending = await getTrending();

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: 'var(--bg)' }}>

        {/* Hero banner */}
        <div style={{ background: 'linear-gradient(135deg,#1a2560,#293581 40%,#2a5ac8 70%,#4274d9)', padding: '48px 20px 40px' }}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.2)' }}>
                <TrendingUp size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white"
                style={{ letterSpacing: '-.02em' }}>
                Trending Articles
              </h1>
            </div>
            <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '15px' }}>
              The most liked and read articles by our community
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {trending.length === 0 ? (
            <div className="text-center py-20" style={{ color: 'var(--tm)' }}>
              <TrendingUp size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-semibold mb-2" style={{ color: 'var(--tp)' }}>No trending data yet</p>
              <p className="text-sm mb-6">Start reading and liking articles to see them here!</p>
              <Link href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,var(--c1),var(--c2))', boxShadow: '0 3px 12px rgba(41,53,129,.28)' }}>
                Explore Articles <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {trending.map((item, i) => (
                <Link key={item.slug} href={`/${item.slug}`}
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all group card-hover"
                  style={{ background: 'var(--sur)', border: '1px solid var(--bdr)', boxShadow: 'var(--sh-sm)' }}>
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 text-white"
                    style={{
                      background: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#f97316' : 'var(--bg3)',
                      color: i < 3 ? 'white' : 'var(--tm)',
                    }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate transition-colors group-hover:text-[var(--c2)]"
                      style={{ color: 'var(--tp)' }}>
                      /{item.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-sm flex-shrink-0"
                    style={{ color: '#ef4444' }}>
                    <Heart size={14} className="fill-red-400" />
                    {item.count.toLocaleString()}
                  </div>
                  <ArrowRight size={14} className="flex-shrink-0 transition-colors group-hover:text-[var(--c2)]"
                    style={{ color: 'var(--bdr)' }} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <BackToTop />
      <Footer />
    </>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES, SITE } from '@/config/site';
import { getPostsByCategory, getCategoryBySlug } from '@/lib/wordpress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadMorePosts from '@/components/category/LoadMorePosts';
import { AdSlot } from '@/components/ui';

export const revalidate = 60;

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const cat = CATEGORIES.find(c => c.slug === params.slug);
  const name = cat?.label ?? params.slug;
  const desc = cat?.description ?? `Articles about ${name} on ${SITE.name}`;
  return { title: `${name} — ${SITE.name}`, description: desc, openGraph: { title: name, type: 'website' } };
}

export default async function CategoryPage({ params }) {
  let cat = CATEGORIES.find(c => c.slug === params.slug);
  if (!cat) {
    const wpCat = await getCategoryBySlug(params.slug);
    if (!wpCat || wpCat.count === 0) notFound();
    cat = { label: wpCat.name, slug: wpCat.slug, description: wpCat.description || `Articles about ${wpCat.name}`, icon: '', parentSlug: wpCat.parent?.node?.slug ?? null };
  }

  const posts = await getPostsByCategory(params.slug, 12);
  const parentCat = cat.parentSlug ? CATEGORIES.find(c => c.slug === cat.parentSlug) : null;

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg)' }}>

        {/* Hero banner */}
        <div style={{ background: 'linear-gradient(135deg,#1a2560,#293581 40%,#2a5ac8 70%,#4274d9)', padding: '48px 20px' }}>
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-sm mb-4 flex-wrap" style={{ color: 'rgba(255,255,255,.6)' }}>
              <Link href="/" className="transition-colors hover:text-white">Home</Link>
              <ChevronRight size={14} />
              {parentCat && (
                <>
                  <Link href={`/category/${parentCat.slug}`} className="transition-colors hover:text-white">{parentCat.label}</Link>
                  <ChevronRight size={14} />
                </>
              )}
              <span style={{ color: 'rgba(255,255,255,.85)', fontWeight: 600 }}>{cat.label}</span>
            </nav>

            <div className="flex items-center gap-3 mb-3">
              {cat.icon && <span className="text-3xl">{cat.icon}</span>}
              <h1 className="text-3xl font-extrabold tracking-tight text-white" style={{ letterSpacing: '-.02em' }}>
                {cat.label}
              </h1>
            </div>
            {cat.description && <p className="max-w-xl" style={{ color: 'rgba(255,255,255,.65)', fontSize: '15px' }}>{cat.description}</p>}
            <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,.45)' }}>
              {posts.length}{posts.length >= 12 ? '+' : ''} article{posts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Ad below header */}
        <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--bdr)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <AdSlot type="leaderboard" />
          </div>
        </div>

        {/* Posts grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {posts.length === 0 ? (
            <div className="text-center py-20" style={{ color: 'var(--tm)' }}>
              <p>No articles in this category yet.</p>
              <Link href="/" className="mt-4 inline-block text-sm" style={{ color: 'var(--c2)' }}><ArrowLeft size={14} style={{marginRight:"5px"}} />Back to Home</Link>
            </div>
          ) : (
            <LoadMorePosts initialPosts={posts} categorySlug={params.slug} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

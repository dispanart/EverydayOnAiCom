import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { CATEGORIES, SITE } from '@/config/site';
import { getPostsByCategory, getCategoryBySlug } from '@/lib/wordpress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadMorePosts from '@/components/category/LoadMorePosts';

export const revalidate = 60;

export async function generateStaticParams() {
  // Include ALL categories + sub-categories
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  // Try local config first, fall back to WordPress
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  const name = cat?.label ?? params.slug;
  const desc = cat?.description ?? `Articles about ${name} on ${SITE.name}`;
  return {
    title: `${name} — ${SITE.name}`,
    description: desc,
    openGraph: { title: name, type: 'website' },
  };
}

export default async function CategoryPage({ params }) {
  // 1. Try local CATEGORIES config
  let cat = CATEGORIES.find((c) => c.slug === params.slug);

  // 2. If not in local config, try fetching from WordPress
  //    This future-proofs against new categories added in WP but not yet in config
  if (!cat) {
    const wpCat = await getCategoryBySlug(params.slug);
    if (!wpCat || wpCat.count === 0) notFound();
    cat = {
      label: wpCat.name,
      slug: wpCat.slug,
      description: wpCat.description || `Articles about ${wpCat.name}`,
      icon: '📂',
      parentSlug: wpCat.parent?.node?.slug ?? null,
    };
  }

  const posts = await getPostsByCategory(params.slug, 12);

  // Breadcrumb: show parent category if sub-category
  const parentCat = cat.parentSlug
    ? CATEGORIES.find((c) => c.slug === cat.parentSlug)
    : null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Header banner */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4 flex-wrap">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <ChevronRight size={14} />
              {parentCat && (
                <>
                  <Link href={`/category/${parentCat.slug}`} className="hover:text-blue-600 transition-colors">
                    {parentCat.label}
                  </Link>
                  <ChevronRight size={14} />
                </>
              )}
              <span className="text-slate-700 font-semibold">{cat.label}</span>
            </nav>

            <div className="flex items-center gap-3 mb-2">
              {cat.icon && <span className="text-3xl">{cat.icon}</span>}
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{cat.label}</h1>
            </div>
            {cat.description && (
              <p className="text-slate-500 max-w-xl mt-1">{cat.description}</p>
            )}
            <p className="text-slate-400 text-sm mt-3">
              {posts.length}{posts.length >= 12 ? '+' : ''} article{posts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Posts */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p>No articles in this category yet.</p>
              <Link href="/" className="mt-4 inline-block text-blue-600 text-sm hover:underline">← Back</Link>
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

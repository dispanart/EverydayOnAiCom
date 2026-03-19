import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Tag, RefreshCw, Calendar } from 'lucide-react';
import { SITE } from '@/config/site';
import { getDisplayDate, formatShortDate, stripHtml } from '@/lib/wordpress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const revalidate = 60;

// Fetch posts by tag via WPGraphQL
async function getPostsByTag(tagSlug, first = 24) {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query PostsByTag($slug: String!, $first: Int!) {
              posts(first: $first, where: { tag: $slug, orderby: { field: MODIFIED, order: DESC } }) {
                nodes {
                  id title slug date modifiedGmt excerpt
                  featuredImage { node { sourceUrl altText } }
                  categories { nodes { name slug } }
                  author { node { name } }
                }
              }
            }
          `,
          variables: { slug: tagSlug, first },
        }),
        next: { revalidate: 60 },
      }
    );
    const json = await res.json();
    return json.data?.posts?.nodes ?? [];
  } catch { return []; }
}

async function getTagBySlug(slug) {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query TagBySlug($slug: ID!) {
              tag(id: $slug, idType: SLUG) { name slug count description }
            }
          `,
          variables: { slug },
        }),
        next: { revalidate: 60 },
      }
    );
    const json = await res.json();
    return json.data?.tag ?? null;
  } catch { return null; }
}

export async function generateMetadata({ params }) {
  const tag = await getTagBySlug(params.slug);
  const name = tag?.name ?? params.slug.replace(/-/g, ' ');
  return {
    title: `#${name}`,
    description: `Semua artikel tentang ${name} di ${SITE.name}`,
  };
}

export default async function TagPage({ params }) {
  const [tag, posts] = await Promise.all([
    getTagBySlug(params.slug),
    getPostsByTag(params.slug),
  ]);

  if (!posts.length && !tag) notFound();

  const displayName = tag?.name ?? params.slug.replace(/-/g, ' ');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-5">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-slate-700 font-semibold">#{displayName}</span>
            </nav>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Tag size={18} className="text-blue-600" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                #{displayName}
              </h1>
            </div>
            {tag?.description && (
              <p className="text-slate-500 mt-2 ml-13 max-w-2xl">{tag.description}</p>
            )}
            <p className="text-slate-400 text-sm mt-1">{posts.length} artikel</p>
          </div>
        </div>

        {/* Posts */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p>No articles with this tag yet.</p>
              <Link href="/" className="mt-4 inline-block text-blue-600 text-sm hover:underline">← Back</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const { date, isUpdated } = getDisplayDate(post);
                const img = post.featuredImage?.node;
                return (
                  <Link key={post.id} href={`/${post.slug}`}
                        className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover">
                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                      {img?.sourceUrl ? (
                        <Image src={img.sourceUrl} alt={img.altText || post.title} fill
                               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                               className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                          <span className="text-blue-200 font-black text-3xl select-none">AI</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h2 className="font-bold text-slate-900 leading-snug mb-2 line-clamp-2
                                    group-hover:text-blue-600 transition-colors">{post.title}</h2>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-3">
                        {stripHtml(post.excerpt).slice(0, 120)}...
                      </p>
                      <span className={`text-xs flex items-center gap-1 ${isUpdated ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                        {isUpdated ? <RefreshCw size={10} /> : <Calendar size={10} />}
                        {isUpdated ? 'Updated ' : ''}{formatShortDate(date)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

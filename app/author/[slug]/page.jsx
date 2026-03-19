import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { User, RefreshCw, Calendar } from 'lucide-react';
import { SITE } from '@/config/site';
import { getDisplayDate, formatShortDate, stripHtml } from '@/lib/wordpress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const revalidate = 60;

async function getAuthorWithPosts(slug) {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query AuthorPosts($slug: String!) {
            users(where: { search: $slug }) {
              nodes {
                name slug description
                avatar { url }
                posts(first: 30, where: { orderby: { field: MODIFIED, order: DESC } }) {
                  nodes {
                    id title slug date modifiedGmt excerpt
                    featuredImage { node { sourceUrl altText } }
                    categories { nodes { name slug } }
                  }
                }
              }
            }
          }
        `,
        variables: { slug },
      }),
      next: { revalidate: 60 },
    });
    const json = await res.json();
    const users = json.data?.users?.nodes ?? [];
    return users.find((u) => u.slug === slug) ?? users[0] ?? null;
  } catch { return null; }
}

export async function generateMetadata({ params }) {
  const author = await getAuthorWithPosts(params.slug);
  const name = author?.name ?? params.slug;
  return {
    title: `Artikel oleh ${name}`,
    description: `Semua artikel dari ${name} di ${SITE.name}`,
  };
}

export default async function AuthorPage({ params }) {
  const author = await getAuthorWithPosts(params.slug);
  if (!author) notFound();

  const posts = author.posts?.nodes ?? [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Author header */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-slate-100 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-slate-700 font-semibold">Penulis</span>
              <span>/</span>
              <span className="text-slate-700 font-semibold">{author.name}</span>
            </nav>

            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-blue-100 flex-shrink-0">
                {author.avatar?.url ? (
                  <Image src={author.avatar.url} alt={author.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={28} className="text-blue-400" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                  {author.name}
                </h1>
                {author.description && (
                  <p className="text-slate-500 max-w-xl leading-relaxed">{author.description}</p>
                )}
                <p className="text-slate-400 text-sm mt-2">{posts.length} artikel ditulis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p>No articles from this author yet.</p>
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

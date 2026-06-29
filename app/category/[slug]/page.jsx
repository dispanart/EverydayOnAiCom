import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CATEGORIES, SITE } from '@/config/site';
import { getPostsByCategory, getCategoryBySlug } from '@/lib/wordpress';
import { PostCard } from '@/components/ui';

export const revalidate = 60;

export async function generateStaticParams() {
 return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
 const cat = CATEGORIES.find((c) => c.slug === params.slug);
 const name = cat?.label ?? params.slug;
 const desc = cat?.description ?? `Articles about ${name} on ${SITE.name}`;
 return { title: `${name} — ${SITE.name}`, description: desc, openGraph: { title: name, type: 'website' } };
}

export default async function CategoryPage({ params }) {
 let cat = CATEGORIES.find((c) => c.slug === params.slug);
 if (!cat) {
 const wpCat = await getCategoryBySlug(params.slug);
 if (!wpCat || wpCat.count === 0) notFound();
 cat = { label: wpCat.name, slug: wpCat.slug, description: wpCat.description || `Articles about ${wpCat.name}`, icon: '' };
 }
 const posts = await getPostsByCategory(params.slug, 24);

 return (
 <>
 <Header />
 <main>
 <div className="apg">
 <div className="w">
 <div className="abrC" style={{ color: 'rgba(255,255,255,.72)' }}><Link href="/" style={{ color: '#fff' }}>Home</Link><span>/</span><span>{cat.label}</span></div>
 <h1>{cat.label}</h1>
 {cat.description && <p>{cat.description}</p>}
 </div>
 </div>
 <div className="w sec">
 {posts.length ? (
 <div className="agrid">
 {posts.map((post) => <PostCard key={post.id || post.slug} post={post} />)}
 </div>
 ) : (
 <div className="wid" style={{ textAlign: 'center', padding: 40 }}>
 <p>No articles in this category yet.</p>
 <Link className="va" href="/">Back home</Link>
 </div>
 )}
 </div>
 </main>
 <Footer />
 </>
 );
}

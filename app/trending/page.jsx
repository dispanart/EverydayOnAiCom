import Link from 'next/link';
import { TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { SITE } from '@/config/site';
import { getRecentPosts, getDisplayDate, formatShortDate } from '@/lib/wordpress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';

export const revalidate = 604800; // 7 days
export const metadata = {
 title: 'Trending',
 description: `Fresh article picks from ${SITE.name}`,
};

async function getTrending() {
 return getRecentPosts(30);
}

export default async function TrendingPage() {
 const trending = await getTrending();

 return (
 <>
 <Header />
 <main className="min-h-screen bg-white">
 <div className="bg-gradient-to-br from-red-50 to-orange-50/30 border-b border-slate-100 py-12">
 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center gap-3 mb-2">
 <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
 <TrendingUp size={18} className="text-red-500" />
 </div>
 <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Trending</h1>
 </div>
 <p className="text-slate-500">Latest articles from EverydayOnAI</p>
 </div>
 </div>

 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
 {trending.length === 0 ? (
 <div className="text-center py-20 text-slate-400">
 <TrendingUp size={48} className="mx-auto mb-4 opacity-20" />
 <p>No articles available yet.</p>
 <Link href="/" className="mt-4 inline-block text-blue-600 text-sm hover:underline">← Browse Articles</Link>
 </div>
 ) : (
 <div className="space-y-3">
 {trending.map((post, i) => (
 <Link key={post.id || post.slug} href={`/${post.slug}`}
 className="flex items-center gap-4 p-4 bg-white border border-slate-100
 rounded-2xl hover:border-slate-200 hover:shadow-sm transition-all group">
 <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0
 ${i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-500'}`}>
 {i + 1}
 </span>
 <div className="flex-1 min-w-0">
 <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors truncate">
 {post.title}
 </p>
 <p className="mt-1 text-xs text-slate-400">{formatShortDate(getDisplayDate(post).date)}</p>
 </div>
 <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-xs flex-shrink-0">
 <Clock size={14} />
 Latest
 </div>
 <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
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

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PostCard, RatedCard, MasonryCard, HorizontalCard } from '@/components/ui';

export default function CategorySilo({ title, viewAllHref, posts = [], layout = 'grid-4' }) {
 if (!posts.length) return null;

 return (
 <section className="sec" aria-labelledby={`silo-${layout}-${title.replace(/\s+/g, '-')}`}>
 <div className="sh">
 <h2 id={`silo-${layout}-${title.replace(/\s+/g, '-')}`} className="st"><span className="sb" />{title}</h2>
 <Link href={viewAllHref} className="va">View All <ArrowRight size={12} strokeWidth={2.5} /></Link>
 </div>

 {layout === 'grid-3-rated' ? (
 <div className="g3">
 {posts.slice(0, 3).map((post) => <RatedCard key={post.id} post={post} />)}
 </div>
 ) : layout === 'masonry' ? (
 <div className="g3">
 {posts.slice(0, 3).map((post, i) => <MasonryCard key={post.id} post={post} tall={false} index={i} />)}
 </div>
 ) : layout === 'horizontal-2col' ? (
 <div className="g3">
 {posts.slice(0, 3).map((post) => <HorizontalCard key={post.id} post={post} />)}
 </div>
 ) : (
 <div className="g3">
 {posts.slice(0, 3).map((post) => <PostCard key={post.id} post={post} />)}
 </div>
 )}
 </section>
 );
}

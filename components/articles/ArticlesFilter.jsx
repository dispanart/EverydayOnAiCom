'use client';

import { useMemo, useState } from 'react';
import { PostCard } from '@/components/ui';

function normalize(value) {
 return String(value || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getPostCategories(post) {
 return post.categories?.nodes || [];
}

export default function ArticlesFilter({ posts = [] }) {
 const topics = useMemo(() => {
 const map = new Map();
 posts.forEach((post) => {
 getPostCategories(post).forEach((category) => {
 if (!category?.name) return;
 map.set(category.slug || normalize(category.name), category.name);
 });
 });
 return Array.from(map, ([slug, name]) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name));
 }, [posts]);

 const [active, setActive] = useState('all');
 const filtered = active === 'all'
 ? posts
 : posts.filter((post) => getPostCategories(post).some((category) => (category.slug || normalize(category.name)) === active));

 return (
 <>
 <div className="fb-bar" aria-label="Filter articles by topic">
 <button type="button" className={`fb ${active === 'all' ? 'on' : ''}`} onClick={() => setActive('all')}>
 All Topics
 </button>
 {topics.map((topic) => (
 <button
 key={topic.slug}
 type="button"
 className={`fb ${active === topic.slug ? 'on' : ''}`}
 onClick={() => setActive(topic.slug)}
 >
 {topic.name}
 </button>
 ))}
 </div>

 {filtered.length ? (
 <div className="agrid">
 {filtered.map((post) => <PostCard key={post.id || post.slug} post={post} />)}
 </div>
 ) : (
 <div className="wid" style={{ textAlign: 'center', padding: 40 }}>No articles found for this topic.</div>
 )}
 </>
 );
}

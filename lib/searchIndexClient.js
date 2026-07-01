'use client';

const SEARCH_INDEX_KEY = 'eonai_search_index_v1';
const SEARCH_INDEX_TTL = 1000 * 60 * 60 * 24 * 7;

let indexPromise = null;

function now() {
 return Date.now();
}

function stripHtml(html) {
 return String(html || '')
 .replace(/<[^>]*>/g, ' ')
 .replace(/\s+/g, ' ')
 .trim();
}

function decodeEntities(value) {
 return String(value || '')
 .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
 .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
 .replace(/&amp;/g, '&')
 .replace(/&quot;/g, '"')
 .replace(/&apos;/g, "'")
 .replace(/&lt;/g, '<')
 .replace(/&gt;/g, '>')
 .replace(/&nbsp;/g, ' ')
 .replace(/&ldquo;/g, '"')
 .replace(/&rdquo;/g, '"')
 .replace(/&lsquo;/g, "'")
 .replace(/&rsquo;/g, "'")
 .replace(/&mdash;/g, '—')
 .replace(/&ndash;/g, '–')
 .replace(/&hellip;/g, '…');
}

function cleanText(value) {
 return decodeEntities(stripHtml(value));
}

function normalize(value) {
 return cleanText(value).toLowerCase();
}

function readCachedIndex() {
 if (typeof window === 'undefined') return null;
 try {
 const raw = window.localStorage.getItem(SEARCH_INDEX_KEY);
 if (!raw) return null;
 const parsed = JSON.parse(raw);
 if (!parsed?.savedAt || !Array.isArray(parsed.posts)) return null;
 if (now() - parsed.savedAt > SEARCH_INDEX_TTL) return null;
 return parsed.posts;
 } catch {
 return null;
 }
}

function writeCachedIndex(posts) {
 if (typeof window === 'undefined') return;
 try {
 window.localStorage.setItem(SEARCH_INDEX_KEY, JSON.stringify({
 savedAt: now(),
 posts,
 }));
 } catch {
 // localStorage may be unavailable in private mode; search still works for the current page.
 }
}

export async function loadSearchIndex() {
 const cached = readCachedIndex();
 if (cached) return cached;

 if (!indexPromise) {
 indexPromise = fetch('/api/search-index', { cache: 'force-cache' })
 .then((res) => res.json())
 .then((data) => {
 const posts = Array.isArray(data.posts) ? data.posts : [];
 writeCachedIndex(posts);
 return posts;
 })
 .catch(() => [])
 .finally(() => {
 indexPromise = null;
 });
 }

 return indexPromise;
}

function postDate(post) {
 return new Date(post?.modifiedGmt || post?.date || 0).getTime() || 0;
}

function categoryMatches(post, category) {
 if (!category) return true;
 return post?.categories?.nodes?.some((node) => node?.slug === category);
}

function scorePost(post, terms, titleOnly) {
 const title = normalize(post?.title);
 const excerpt = titleOnly ? '' : normalize(post?.excerpt);
 const categories = titleOnly ? '' : normalize(post?.categories?.nodes?.map((c) => c.name).join(' '));
 const haystack = titleOnly ? title : `${title} ${excerpt} ${categories}`;

 if (!terms.every((term) => haystack.includes(term))) return 0;

 let score = 1;
 for (const term of terms) {
 if (title === term) score += 20;
 if (title.startsWith(term)) score += 12;
 if (title.includes(term)) score += 8;
 if (excerpt.includes(term)) score += 2;
 if (categories.includes(term)) score += 1;
 }
 return score;
}

export function searchLocalPosts(posts, query, {
 category = '',
 sort = 'relevance',
 limit = 12,
 titleOnly = false,
} = {}) {
 const terms = normalize(query).split(/\s+/).filter(Boolean);
 if (!terms.length || !Array.isArray(posts)) return [];

 const matched = posts
 .filter((post) => categoryMatches(post, category))
 .map((post) => ({ post, score: scorePost(post, terms, titleOnly) }))
 .filter((item) => item.score > 0);

 if (sort === 'date_asc') {
 matched.sort((a, b) => postDate(a.post) - postDate(b.post));
 } else if (sort === 'date_desc') {
 matched.sort((a, b) => postDate(b.post) - postDate(a.post));
 } else {
 matched.sort((a, b) => b.score - a.score || postDate(b.post) - postDate(a.post));
 }

 return matched.slice(0, limit).map((item) => item.post);
}

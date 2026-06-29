import { SITE } from '@/config/site';
import { getRecentPosts, stripHtmlAndDecode } from '@/lib/wordpress';

export const revalidate = 300;

function escapeXml(value) {
 return String(value || '')
 .replace(/&/g, '&amp;')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;')
 .replace(/"/g, '&quot;')
 .replace(/'/g, '&apos;');
}

export async function GET() {
 const posts = await getRecentPosts(50);
 const items = posts.map((post) => {
 const url = `${SITE.url}/${post.slug}`;
 const title = stripHtmlAndDecode(post.title);
 const description = stripHtmlAndDecode(post.excerpt || '').slice(0, 300);
 const pubDate = new Date(post.date || post.modifiedGmt || Date.now()).toUTCString();

 return `
  <item>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(url)}</link>
    <guid isPermaLink="true">${escapeXml(url)}</guid>
    <description>${escapeXml(description)}</description>
    <pubDate>${escapeXml(pubDate)}</pubDate>
  </item>`;
 }).join('');

 const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
 <channel>
  <title>${escapeXml(SITE.name)}</title>
  <link>${escapeXml(SITE.url)}</link>
  <description>${escapeXml(SITE.description)}</description>
  <language>en-US</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  ${items}
 </channel>
</rss>`;

 return new Response(xml, {
 status: 200,
 headers: {
 'Content-Type': 'application/rss+xml; charset=utf-8',
 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
 },
 });
}

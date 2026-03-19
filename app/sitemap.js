// app/sitemap.js — Auto-generates XML sitemap for Google
import { SITE, CATEGORIES } from '@/config/site';
import { getAllPostSlugs, getAllCategories } from '@/lib/wordpress';

export default async function sitemap() {
  const [slugs, categories] = await Promise.all([
    getAllPostSlugs(),
    getAllCategories(),
  ]);

  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: SITE.url, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE.url}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Category pages
  const categoryPages = categories
    .filter((c) => c.slug !== 'uncategorized')
    .map((cat) => ({
      url: `${SITE.url}/category/${cat.slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    }));

  // Post pages
  const postPages = slugs.map(({ slug }) => ({
    url: `${SITE.url}/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}

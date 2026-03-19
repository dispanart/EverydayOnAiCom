/**
 * ─────────────────────────────────────────────────────────────────
 *  lib/wordpress.js — WordPress GraphQL API client
 *  All data fetching goes through this file.
 * ─────────────────────────────────────────────────────────────────
 */

const WP_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://everydayonai.com/graphql';

/**
 * Core fetch wrapper with error handling and ISR support.
 * @param {string} query  - GraphQL query string
 * @param {object} vars   - Query variables
 * @param {number} revalidate - ISR revalidation seconds (default 60)
 */
async function fetchWP(query, vars = {}, revalidate = 60) {
  try {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: vars }),
      next: { revalidate },
    });

    if (!res.ok) {
      console.error(`[WP GraphQL] HTTP ${res.status} — ${res.statusText}`);
      return null;
    }

    const json = await res.json();

    if (json.errors?.length) {
      console.error('[WP GraphQL] Query errors:', JSON.stringify(json.errors));
    }

    return json.data ?? null;
  } catch (err) {
    console.error('[WP GraphQL] Network error:', err.message);
    return null;
  }
}

// ─── SHARED FIELD FRAGMENTS ────────────────────────────────────────────────

/**
 * Standard post fields used across all list queries.
 * modifiedGmt = last updated time (shown instead of publish date when newer).
 */
const POST_CARD_FIELDS = `
  id
  title
  slug
  date
  modifiedGmt
  excerpt
  featuredImage {
    node {
      sourceUrl
      srcSet
      sizes
      altText
      mediaDetails { width height }
    }
  }
  categories { nodes { name slug parentId } }
  author { node { name } }
`;

/** Full post fields for single article page */
const POST_FULL_FIELDS = `
  id
  title
  slug
  date
  modifiedGmt
  content
  excerpt
  featuredImage {
    node {
      sourceUrl
      srcSet
      sizes
      altText
      mediaDetails { width height }
    }
  }
  categories { nodes { name slug parentId } }
  tags { nodes { name slug } }
  author {
    node {
      name
      description
      avatar { url }
    }
  }
`;

// ─── QUERY FUNCTIONS ────────────────────────────────────────────────────────

/** Latest post for the hero section */
export async function getFeaturedPost() {
  const data = await fetchWP(`
    query FeaturedPost {
      posts(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
        nodes { ${POST_CARD_FIELDS} }
      }
    }
  `);
  return data?.posts?.nodes?.[0] ?? null;
}

/**
 * Posts by category slug — supports any WP category/subcategory.
 * @param {string} categorySlug - WordPress category slug
 * @param {number} first        - Number of posts to fetch
 */
export async function getPostsByCategory(categorySlug, first = 4) {
  const data = await fetchWP(
    `
    query PostsByCategory($slug: String!, $first: Int!) {
      posts(
        first: $first
        where: { categoryName: $slug, orderby: { field: MODIFIED, order: DESC } }
      ) {
        nodes { ${POST_CARD_FIELDS} }
      }
    }
  `,
    { slug: categorySlug, first }
  );
  return data?.posts?.nodes ?? [];
}

/**
 * All categories with their subcategories — used for nav dropdown and sitemap.
 * Fetches up to 100 non-empty categories.
 */
export async function getAllCategories() {
  const data = await fetchWP(
    `
    query AllCategories {
      categories(first: 100, where: { hideEmpty: true }) {
        nodes {
          id
          name
          slug
          count
          parentId
          children {
            nodes { id name slug count parentId }
          }
        }
      }
    }
  `,
    {},
    300 // cache 5 minutes — categories change rarely
  );
  return data?.categories?.nodes ?? [];
}

/** Top-level categories only (no parent), excluding Uncategorized */
export async function getNavCategories() {
  const all = await getAllCategories();
  return all.filter(
    (cat) => !cat.parentId && cat.slug !== 'uncategorized' && (cat.count ?? 0) > 0
  );
}

/**
 * Single category info by slug — used for category archive page.
 * Returns name, description, parent, and children.
 */
export async function getCategoryBySlug(slug) {
  const data = await fetchWP(
    `
    query CategoryBySlug($slug: ID!) {
      category(id: $slug, idType: SLUG) {
        id name slug count description
        parentId
        parent { node { name slug } }
        children { nodes { id name slug count } }
      }
    }
  `,
    { slug }
  );
  return data?.category ?? null;
}

/** Single post by slug — used for article page */
export async function getPostBySlug(slug) {
  const data = await fetchWP(
    `
    query PostBySlug($slug: String!) {
      postBy(slug: $slug) { ${POST_FULL_FIELDS} }
    }
  `,
    { slug },
    60
  );
  return data?.postBy ?? null;
}

/** All post slugs — used for static generation at build time */
export async function getAllPostSlugs() {
  const data = await fetchWP(
    `
    query AllSlugs {
      posts(first: 2000) { nodes { slug } }
    }
  `,
    {},
    3600 // cache 1 hour — only used at build time
  );
  return data?.posts?.nodes ?? [];
}

/** Search posts by keyword */
export async function searchPosts(query, first = 12) {
  const data = await fetchWP(
    `
    query SearchPosts($query: String!, $first: Int!) {
      posts(first: $first, where: { search: $query }) {
        nodes { ${POST_CARD_FIELDS} }
      }
    }
  `,
    { query, first }
  );
  return data?.posts?.nodes ?? [];
}

/** Recent posts for sidebar trending widget */
export async function getRecentPosts(first = 5) {
  const data = await fetchWP(
    `
    query RecentPosts($first: Int!) {
      posts(first: $first, where: { orderby: { field: MODIFIED, order: DESC } }) {
        nodes {
          id title slug date modifiedGmt
          categories { nodes { name slug } }
        }
      }
    }
  `,
    { first }
  );
  return data?.posts?.nodes ?? [];
}

// ─── DATE HELPERS ───────────────────────────────────────────────────────────

/**
 * Determines which date to display on a post.
 * Shows "Updated [date]" when the post was meaningfully modified
 * after the original publish date (>1 hour difference).
 *
 * @param {{ date: string, modifiedGmt?: string }} post
 * @returns {{ date: Date, isUpdated: boolean }}
 */
export function getDisplayDate(post) {
  if (!post) return { date: new Date(), isUpdated: false };
  const published = new Date(post.date);
  const modified = post.modifiedGmt ? new Date(post.modifiedGmt) : null;
  const isUpdated = !!(modified && modified - published > 3_600_000); // > 1 hour
  return { date: isUpdated ? modified : published, isUpdated };
}

/**
 * Formats a Date object to a human-readable string.
 * @param {Date} dateObj
 * @returns {string}  e.g. "March 5, 2025"
 */
export function formatDisplayDate(dateObj) {
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Short date format for card metadata.
 * @param {Date} dateObj
 * @returns {string}  e.g. "Mar 5, 2025"
 */
export function formatShortDate(dateObj) {
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Strip HTML tags — used for meta descriptions and excerpts */
export function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, '').trim() ?? '';
}

/** Decode HTML entities — fixes &#8220; &#8221; &amp; &quot; etc from WordPress */
export function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
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

/** Strip HTML tags AND decode entities — safe for plain text display */
export function stripHtmlAndDecode(html) {
  if (!html) return '';
  const stripped = html.replace(/<[^>]*>/g, '').trim();
  return decodeHtmlEntities(stripped);
}

// ─── WordPress Pages ──────────────────────────────────────────────────────────

/**
 * Ambil konten halaman statis dari WordPress berdasarkan slug
 * Cara pakai: buat Page di WordPress dengan slug yang sama (about, contact, dll)
 */
export async function getPageBySlug(slug) {
  const data = await fetchWP(
    `
    query GetPage($slug: ID!) {
      page(id: $slug, idType: URI) {
        title
        content
        modifiedGmt
      }
    }
  `,
    { slug },
    3600
  );
  return data?.page ?? null;
}

/**
 * ─────────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — Single source of truth
 *  Update category slugs, nav, and site settings here only.
 * ─────────────────────────────────────────────────────────────────
 */

export const SITE = {
  name: 'EverydayOnAI',
  tagline: 'Your Daily Dose of Artificial Intelligence',
  description:
    'Explore practical AI insights for business, tools, creativity, and everyday life.',
  url: 'https://everydayonai.com',
  locale: 'en_US',
  twitterHandle: '@EverydayOnAI',
  email: 'hello@everydayonai.com',
};

/**
 * Main categories — must match WordPress category slugs exactly.
 * Add or remove entries here as your WordPress categories change.
 */
export const CATEGORIES = [
  {
    label: 'AI for Business',
    slug: 'ai-for-business',
    description: 'Practical AI strategies, use cases, and ROI for companies of all sizes.',
    layout: 'grid-4',
    postCount: 4,
    parentSlug: null,
  },
  {
    label: 'AI Tools Review & Comparison',
    slug: 'ai-tools-review-comparison',
    description: 'Honest, in-depth reviews and head-to-head comparisons of AI software.',
    layout: 'grid-3-rated',
    postCount: 3,
    parentSlug: null,
  },
  {
    label: 'AI for Ideas & Creativity',
    slug: 'ai-for-ideas-creativity',
    description: 'How AI transforms art, writing, music, design, and creative work.',
    layout: 'masonry',
    postCount: 4,
    parentSlug: null,
  },
  {
    // Sub-category of AI for Ideas & Creativity
    label: 'AI Prompts & Guides',
    slug: 'ai-prompts-guides',
    description: 'Step-by-step prompt guides and templates for ChatGPT, Midjourney, and more.',
    layout: 'grid-4',
    postCount: 4,
    parentSlug: 'ai-for-ideas-creativity',
    icon: '✍️',
  },
  {
    label: 'Everyday AI & Lifestyle',
    slug: 'everyday-ai-lifestyle',
    description: 'AI in daily life — productivity, health, education, and more.',
    layout: 'horizontal-2col',
    postCount: 4,
    parentSlug: null,
  },
];

/** Navigation links for the header */
export const NAV_LINKS = [
  { label: 'Home',                    href: '/' },
  { label: 'Business AI',             href: '/category/ai-for-business',          slug: 'ai-for-business' },
  { label: 'AI Tools',                href: '/category/ai-tools-review-comparison', slug: 'ai-tools-review-comparison' },
  { label: 'Ideas & Creativity',      href: '/category/ai-for-ideas-creativity',   slug: 'ai-for-ideas-creativity' },
  { label: 'Everyday AI',             href: '/category/everyday-ai-lifestyle',     slug: 'everyday-ai-lifestyle' },
  { label: 'About',                   href: '/about' },
];

/** Footer navigation columns */
export const FOOTER_LINKS = {
  topics: CATEGORIES.map((c) => ({ label: c.label, href: `/category/${c.slug}` })),
  company: [
    { label: 'About Us',      href: '/about' },
    { label: 'Contact',       href: '/contact' },
    { label: 'Privacy Policy',href: '/privacy-policy' },
    { label: 'Terms',         href: '/terms' },
    { label: 'Disclaimer',    href: '/disclaimer' },
  ],
};

import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import { SITE } from '@/config/site';
import { getPageBySlug } from '@/lib/wordpress';

export const revalidate = 3600; // refresh setiap 1 jam

export const metadata = { title: 'About Us' };

// Konten default jika halaman belum dibuat di WordPress
const DEFAULT_CONTENT = `
  <p><strong>EverydayOnAI</strong> is your daily source for practical, accessible AI insights.
  We cover artificial intelligence the way it actually affects real people — in business,
  creativity, tools, and everyday life.</p>

  <p>Our mission is simple: make AI understandable and actionable for everyone, not just
  engineers and researchers. Whether you're a business owner looking to automate workflows,
  a creative exploring AI art tools, or simply curious about how AI is reshaping the world
  — you're in the right place.</p>

  <h2>What We Cover</h2>
  <ul>
    <li><strong>AI for Business</strong> — strategies, ROI, and use cases for companies</li>
    <li><strong>AI Tools Review</strong> — honest comparisons of the latest AI software</li>
    <li><strong>Ideas & Creativity</strong> — AI in art, writing, music, and design</li>
    <li><strong>Everyday AI & Lifestyle</strong> — AI in health, education, and daily life</li>
  </ul>

  <h2>Get in Touch</h2>
  <p>Questions, partnerships, or press inquiries? Email us at
  <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
`;

export default async function AboutPage() {
  const page = await getPageBySlug('about');

  return (
    <PageWrapper>
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-10">
            {page?.title ?? 'About EverydayOnAI'}
          </h1>
          <div
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: page?.content ?? DEFAULT_CONTENT }}
          />
          <div className="mt-12">
            <Link href="/" className="text-sm text-blue-600 hover:underline">← Back to Home</Link>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}

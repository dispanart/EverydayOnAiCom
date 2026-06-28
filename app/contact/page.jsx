import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import { SITE } from '@/config/site';
import { getPageBySlug } from '@/lib/wordpress';

export const revalidate = 3600;

export const metadata = { title: 'Contact' };

const DEFAULT_CONTENT = `
  <p>For editorial inquiries, partnerships, sponsorships, or general questions,
  feel free to reach out to us. We typically respond within 1–2 business days.</p>
  <p><strong>Email:</strong> <a href="mailto:${SITE.email}">${SITE.email}</a></p>
`;

export default async function ContactPage() {
  const page = await getPageBySlug('contact');

  return (
    <PageWrapper>
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-10">
            {page?.title ?? 'Contact Us'}
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

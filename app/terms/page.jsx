import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import { SITE } from '@/config/site';
import { getPageBySlug } from '@/lib/wordpress';

export const revalidate = 3600;

export const metadata = { title: 'Terms of Service' };

const DEFAULT_CONTENT = `
  <h2>1. Acceptance of Terms</h2>
  <p>By accessing ${SITE.name}, you agree to be bound by these Terms of Service.
  If you disagree, please do not use our website.</p>

  <h2>2. Content</h2>
  <p>All content on ${SITE.name} is for informational purposes only. We make no warranties
  about the accuracy or completeness of the information provided.</p>

  <h2>3. Intellectual Property</h2>
  <p>All content, including articles, graphics, and logos, is the property of ${SITE.name}
  unless otherwise stated. You may not reproduce content without written permission.</p>

  <h2>4. Third-Party Links</h2>
  <p>We may link to third-party websites. We are not responsible for their content
  or privacy practices.</p>

  <h2>5. Contact</h2>
  <p>For questions about these terms, contact
  <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
`;

export default async function TermsPage() {
  const page = await getPageBySlug('terms');

  return (
    <PageWrapper>
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            {page?.title ?? 'Terms of Service'}
          </h1>
          <p className="text-slate-400 text-sm mb-10">Last updated: March 2026</p>
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

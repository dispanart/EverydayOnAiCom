import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import { SITE } from '@/config/site';
import { getPageBySlug } from '@/lib/wordpress';

export const revalidate = 3600;

export const metadata = { title: 'Disclaimer' };

const DEFAULT_CONTENT = `
  <h2>Affiliate Disclosure</h2>
  <p>${SITE.name} may earn a commission from affiliate links at no extra cost to you.
  We only recommend products we genuinely believe in. Affiliate relationships do not
  influence our editorial content or reviews.</p>

  <h2>Advertising Disclosure</h2>
  <p>This site displays advertisements served by Google AdSense and other networks.
  Ads are clearly labeled and do not influence our editorial decisions.</p>

  <h2>Accuracy of Information</h2>
  <p>While we strive to keep information accurate and up to date, the AI landscape changes
  rapidly. We make no guarantees about the completeness or accuracy of content. Always
  verify important decisions with official sources.</p>

  <h2>Contact</h2>
  <p>Questions? Email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
`;

export default async function DisclaimerPage() {
  const page = await getPageBySlug('disclaimer');

  return (
    <PageWrapper>
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            {page?.title ?? 'Disclaimer'}
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

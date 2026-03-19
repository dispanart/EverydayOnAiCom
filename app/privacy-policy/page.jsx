import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import { SITE } from '@/config/site';
import { getPageBySlug } from '@/lib/wordpress';

export const revalidate = 3600;

export const metadata = { title: 'Privacy Policy' };

const DEFAULT_CONTENT = `
  <h2>1. Information We Collect</h2>
  <p>We collect information you provide directly (e.g. newsletter signup email), and automatically
  via cookies and analytics tools (page views, device type, referral source).</p>

  <h2>2. How We Use Your Information</h2>
  <p>We use collected information to send newsletters, improve content, and serve relevant
  advertising via Google AdSense. We do not sell your personal data to third parties.</p>

  <h2>3. Google AdSense & Cookies</h2>
  <p>We use Google AdSense to display ads. Google may use cookies to serve ads based on your
  prior visits to this and other websites. You can opt out via
  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
  Google Ads Settings</a>.</p>

  <h2>4. Google Analytics</h2>
  <p>We use Google Analytics to understand how visitors interact with our website.
  This data is anonymous and aggregated. You can opt out via the
  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
  Google Analytics Opt-out Browser Add-on</a>.</p>

  <h2>5. Your Rights</h2>
  <p>You have the right to access, correct, or delete your personal data. To exercise these
  rights, contact us at <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>

  <h2>6. Contact</h2>
  <p>Questions about this policy? Email us at <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
`;

export default async function PrivacyPolicyPage() {
  const page = await getPageBySlug('privacy-policy');

  return (
    <PageWrapper>
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            {page?.title ?? 'Privacy Policy'}
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

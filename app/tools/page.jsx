import PageWrapper from '@/components/layout/PageWrapper';
import { AdSlot } from '@/components/ui';
import ToolsGrid from '@/components/tools/ToolsGrid';
import { SITE } from '@/config/site';

export const metadata = {
  title: 'AI Tools Directory',
  description: 'Discover the best AI tools across every category — reviewed, rated, and updated weekly.',
  openGraph: {
    title: `AI Tools Directory — ${SITE.name}`,
    description: 'Discover the best AI tools across every category — reviewed, rated, and updated weekly.',
    url: `${SITE.url}/tools`,
    siteName: SITE.name,
    type: 'website',
  },
};

export default function ToolsPage() {
  return (
    <PageWrapper>
      <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--bdr)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
            <h1 className="text-2xl sm:text-[28px] font-extrabold mb-1.5" style={{ color: 'var(--tp)' }}>
              🛠 AI Tools Directory
            </h1>
            <p className="text-[15px]" style={{ color: 'var(--ts)' }}>
              Discover the best AI tools across every category — reviewed, rated, and updated weekly.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
          <div className="mb-7">
            <AdSlot type="leaderboard" />
          </div>

          <ToolsGrid />

          <div className="mt-3">
            <AdSlot type="leaderboard" />
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}

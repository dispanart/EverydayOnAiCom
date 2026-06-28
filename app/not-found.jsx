import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';

export default function NotFound() {
  return (
    <PageWrapper>
      <main className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <p className="text-8xl font-black text-blue-100 select-none mb-4">404</p>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Page Not Found</h1>
          <p className="text-slate-500 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                       text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </PageWrapper>
  );
}

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';

export default function NotFound() {
  return (
    <PageWrapper>
      <main className="min-h-[70vh] flex items-center justify-center" style={{background:"var(--bg)"}}>
        <div className="text-center px-4">
          <p className="text-8xl font-black select-none mb-4" style={{color:"rgba(66,116,217,.12)"}}>404</p>
          <h1 className="text-2xl font-extrabold mb-3" style={{color:"var(--tp)"}}>Page Not Found</h1>
          <p className="mb-8" style={{color:"var(--tm)"}}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                       text-white font-bold px-6 py-3 rounded-xl transition-colors"
          ><ArrowLeft size={14} style={{marginRight:"5px"}} />Back to Home</Link>
        </div>
      </main>
    </PageWrapper>
  );
}

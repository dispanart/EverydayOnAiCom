'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => { console.error('[App Error]', error); }, [error]);
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={36} className="text-red-400" />
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 mb-2">500</h1>
        <h2 className="text-xl font-bold text-slate-700 mb-3">Server Error</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Sorry, something went wrong on our end. Our team is working to fix it.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                       font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            <RefreshCw size={15} />Try Again
          </button>
          <Link href="/"
            className="flex items-center gap-2 border border-slate-200 hover:border-blue-300
                       text-slate-600 hover:text-blue-600 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            <Home size={15} />Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

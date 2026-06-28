'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, Loader2, Zap, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus(data.message === 'already_subscribed' ? 'duplicate' : 'success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to subscribe, please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Connection failed, please try again.');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Zap size={28} className="text-white fill-white" />
            </div>

            {status === 'success' ? (
              <div className="text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-extrabold text-slate-900 mb-2">You're Subscribed! 🎉</h1>
                <p className="text-slate-500 mb-6">
                  Thank you! The best AI insights will be delivered to your inbox every week.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors">
                  <ArrowLeft size={14} /> Back to Home
                </Link>
              </div>
            ) : status === 'duplicate' ? (
              <div className="text-center">
                <CheckCircle size={48} className="text-blue-500 mx-auto mb-4" />
                <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Already Subscribed ✓</h1>
                <p className="text-slate-500 mb-6">This email is already on our subscriber list.</p>
                <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors">
                  <ArrowLeft size={14} /> Back to Home
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
                    Subscribe to Newsletter
                  </h1>
                  <p className="text-slate-500 leading-relaxed">
                    Get the best AI insights delivered to your inbox. Free, every week, no spam.
                  </p>
                </div>

                <ul className="space-y-2.5 mb-8">
                  {[
                    '⚡ Weekly roundup of the latest AI tools',
                    '📊 Practical AI tips for business & productivity',
                    '🎯 Exclusive content for subscribers only',
                    '🚫 No spam, unsubscribe anytime',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    aria-label="Email address"
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               text-slate-800 placeholder:text-slate-400 text-sm
                               disabled:opacity-60 transition-all"
                  />
                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle size={14} />{errorMsg}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2
                               bg-blue-600 hover:bg-blue-700 text-white font-bold
                               py-3 px-6 rounded-xl transition-all
                               hover:shadow-lg hover:shadow-blue-200/60 hover:-translate-y-0.5
                               disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                  >
                    {status === 'loading' ? (
                      <><Loader2 size={16} className="animate-spin" />Subscribing...</>
                    ) : (
                      <><Mail size={16} />Subscribe Now — It's Free!</>
                    )}
                  </button>
                </form>

                <p className="text-center text-xs text-slate-400 mt-4">
                  By subscribing, you agree to our{' '}
                  <Link href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
                </p>
              </>
            )}
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
              ← Back to EverydayOnAI
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

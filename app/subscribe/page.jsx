'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, Loader2, Zap, ArrowLeft, Sparkles, BarChart2, Lock, Star } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const PERKS = [
  { Icon: Zap,      text: 'Weekly roundup of the latest AI tools' },
  { Icon: BarChart2,text: 'Practical AI tips for business & productivity' },
  { Icon: Star,     text: 'Exclusive content for subscribers only' },
  { Icon: Lock,     text: 'No spam, unsubscribe anytime' },
];

export default function SubscribePage() {
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;
    setStatus('loading'); setErrorMsg('');
    try {
      const res  = await fetch('/api/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus(data.message === 'already_subscribed' ? 'duplicate' : 'success');
        setEmail('');
      } else { setStatus('error'); setErrorMsg(data.error || 'Failed to subscribe, please try again.'); }
    } catch { setStatus('error'); setErrorMsg('Connection failed, please try again.'); }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: 'var(--bg)' }}>
        <div className="w-full max-w-md">
          <div className="rounded-3xl p-8" style={{ background: 'var(--sur)', border: '1px solid var(--bdr)', boxShadow: 'var(--sh-lg)' }}>

            {/* Logo icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto"
              style={{ background: 'linear-gradient(135deg,var(--c1),var(--c2))', boxShadow: '0 6px 18px rgba(41,53,129,.28)' }}>
              <Zap size={28} className="text-white fill-white" />
            </div>

            {/* Success state */}
            {status === 'success' ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.2)' }}>
                  <CheckCircle size={28} style={{ color: '#22c55e' }} />
                </div>
                <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--tp)' }}>You're Subscribed!</h1>
                <p className="mb-6" style={{ color: 'var(--tm)' }}>
                  The best AI insights will be delivered to your inbox every week.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 font-semibold text-sm transition-colors"
                  style={{ color: 'var(--c2)' }}>
                  <ArrowLeft size={14} /> Back to Home
                </Link>
              </div>

            /* Already subscribed state */
            ) : status === 'duplicate' ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(66,116,217,.12)', border: '1px solid rgba(66,116,217,.2)' }}>
                  <CheckCircle size={28} style={{ color: 'var(--c2)' }} />
                </div>
                <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--tp)' }}>Already Subscribed</h1>
                <p className="mb-6" style={{ color: 'var(--tm)' }}>This email is already on our subscriber list.</p>
                <Link href="/" className="inline-flex items-center gap-2 font-semibold text-sm transition-colors"
                  style={{ color: 'var(--c2)' }}>
                  <ArrowLeft size={14} /> Back to Home
                </Link>
              </div>

            /* Form state */
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-extrabold mb-2 tracking-tight" style={{ color: 'var(--tp)', letterSpacing: '-.02em' }}>
                    Subscribe to Newsletter
                  </h1>
                  <p className="leading-relaxed" style={{ color: 'var(--tm)' }}>
                    Get the best AI insights delivered to your inbox. Free, every week, no spam.
                  </p>
                </div>

                {/* Perks list with Lucide icons */}
                <ul className="space-y-2.5 mb-8">
                  {PERKS.map(({ Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-sm" style={{ color: 'var(--ts)' }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(66,116,217,.1)' }}>
                        <Icon size={13} style={{ color: 'var(--c2)' }} />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    required placeholder="your@email.com" aria-label="Email address"
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all disabled:opacity-60"
                    style={{ background: 'var(--bg3)', border: '1px solid var(--bdr)', color: 'var(--tp)', fontFamily: 'inherit' }}
                    onFocus={e => e.target.style.borderColor = 'var(--c2)'}
                    onBlur={e => e.target.style.borderColor = 'var(--bdr)'}
                  />
                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#ef4444' }}>
                      <AlertCircle size={14} />{errorMsg}
                    </div>
                  )}
                  <button type="submit" disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg,var(--c1),var(--c2))', color: 'white', boxShadow: '0 3px 14px rgba(41,53,129,.28)', fontFamily: 'inherit' }}>
                    {status === 'loading'
                      ? <><Loader2 size={16} className="animate-spin" />Subscribing...</>
                      : <><Mail size={16} />Subscribe Now — It's Free!</>}
                  </button>
                </form>

                <p className="text-center text-xs mt-4" style={{ color: 'var(--tm)' }}>
                  By subscribing, you agree to our{" "}
                  <Link href="/privacy-policy" className="hover:underline" style={{ color: 'var(--c2)' }}>Privacy Policy</Link>.
                </p>
              </>
            )}
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: 'var(--tm)' }}>
              <ArrowLeft size={13} /> Back to EverydayOnAI
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

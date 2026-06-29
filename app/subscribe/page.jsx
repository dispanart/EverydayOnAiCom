'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, Loader2, ArrowLeft, Sparkles, ShieldCheck, Clock3 } from 'lucide-react';
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
 if (res.ok && (data.success || data.ok)) {
 setStatus(data.message === 'already_subscribed' || data.status === 'already_subscribed' ? 'duplicate' : 'success');
 setEmail('');
 } else {
 setStatus('error');
 setErrorMsg(data.message || data.error || 'Failed to subscribe, please try again.');
 }
 } catch {
 setStatus('error');
 setErrorMsg('Connection failed, please try again.');
 }
 };

 return (
 <>
 <Header />
 <main className="subscribe-page min-h-screen">
 <div className="subscribe-bg">
 <div className="subscribe-card">
 <div className="subscribe-logo">
 <Image src="/icon-512.png" alt="EverydayOnAI" width={64} height={64} priority />
 </div>

 {status === 'success' ? (
 <div className="text-center">
 <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
 <h1 className="text-2xl font-extrabold text-slate-900 mb-2">You're Subscribed! </h1>
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
 <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Already Subscribed </h1>
 <p className="text-slate-500 mb-6">This email is already on our subscriber list.</p>
 <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors">
 <ArrowLeft size={14} /> Back to Home
 </Link>
 </div>
 ) : (
 <>
 <div className="text-center mb-8">
 <div className="subscribe-eyebrow"><Sparkles size={13} />Free Weekly AI Briefing</div>
 <h1 className="subscribe-title">
 Subscribe to EverydayOnAI
 </h1>
 <p className="subscribe-copy">
 Clear AI governance, tools, and search insights delivered weekly. No noise, no spam.
 </p>
 </div>

 <ul className="subscribe-perks">
 {[
 [Sparkles, 'Weekly AI tools, policy, and strategy updates'],
 [Clock3, 'Readable summaries you can finish quickly'],
 [ShieldCheck, 'No spam. Unsubscribe anytime'],
 ].map(([Icon, item]) => (
 <li key={item}>
 <span><Icon size={15} /></span>
 <strong>{item}</strong>
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
 className="subscribe-input"
 />
 {status === 'error' && (
 <div className="flex items-center gap-2 text-red-500 text-sm">
 <AlertCircle size={14} />{errorMsg}
 </div>
 )}
 <button
 type="submit"
 disabled={status === 'loading'}
 className="subscribe-submit"
 >
 {status === 'loading' ? (
 <><Loader2 size={16} className="animate-spin" />Subscribing...</>
 ) : (
 <><Mail size={16} /><span>Subscribe Free</span></>
 )}
 </button>
 </form>

 <p className="subscribe-legal">
 By subscribing, you agree to our{' '}
 <Link href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
 </p>
 </>
 )}
 </div>

 <div className="text-center mt-6">
 <Link href="/" className="subscribe-back">
 ← Back to EverydayOnAI
 </Link>
 </div>
 </div>
 </main>
 <Footer />
 </>
 );
}

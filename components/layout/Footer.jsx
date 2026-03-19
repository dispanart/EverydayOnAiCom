'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Mail, Twitter, Linkedin, Youtube, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { SITE, FOOTER_LINKS } from '@/config/site';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
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
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="EverydayOnAI">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                EverydayOn<span className="text-blue-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">{SITE.description}</p>
            <div className="flex gap-3 mt-5">
              {[
                { Icon: Twitter,  label: 'Twitter',  href: '#' },
                { Icon: Linkedin, label: 'LinkedIn', href: '#' },
                { Icon: Youtube,  label: 'YouTube',  href: '#' },
              ].map(({ Icon, label, href }) => (
                <a key={label} href={href} aria-label={label}
                   className="w-8 h-8 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={14} className="text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Topics</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.topics.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-500 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-500 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-sm mb-2 uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              The best AI insights every week. Free, no spam.
            </p>

            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                <CheckCircle size={16} />You're in! Check your inbox. 🎉
              </div>
            )}

            {status === 'duplicate' && (
              <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
                <CheckCircle size={16} />This email is already subscribed. ✓
              </div>
            )}

            {status !== 'success' && status !== 'duplicate' && (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  aria-label="Email for newsletter"
                  disabled={status === 'loading'}
                  className="bg-slate-800 text-white text-sm px-4 py-2.5 rounded-lg
                             border border-slate-700 focus:outline-none focus:border-blue-500
                             placeholder:text-slate-600 transition-colors disabled:opacity-60"
                />
                {status === 'error' && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs">
                    <AlertCircle size={12} />{errorMsg}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
                             text-white text-sm font-semibold px-4 py-2.5 rounded-lg
                             transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <><Loader2 size={14} className="animate-spin" />Subscribing...</>
                  ) : (
                    <><Mail size={14} />Subscribe Free</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span>Built with Next.js + Headless WordPress</span>
        </div>
      </div>
    </footer>
  );
}

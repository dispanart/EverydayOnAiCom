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
    setStatus('loading'); setErrorMsg('');
    try {
      const res = await fetch('/api/subscribe', {
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
    <footer style={{ background: 'var(--c1)', color: 'rgba(255,255,255,.8)', marginTop: '48px' }}>
      {/* Glow top line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,rgba(149,204,213,.5),rgba(66,116,217,.4),transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4" aria-label="EverydayOnAI">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.2)' }}>
                <Zap size={17} className="text-white fill-white" />
              </div>
              <span className="font-extrabold text-[17px] text-white tracking-tight" style={{ letterSpacing: '-.02em' }}>
                EverydayOn<em style={{ fontStyle: 'normal', color: 'var(--c3)' }}>AI</em>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,.5)' }}>{SITE.description}</p>
            <div className="flex gap-2.5">
              {[{ Icon: Twitter, label: 'Twitter', href: '#' }, { Icon: Linkedin, label: 'LinkedIn', href: '#' }, { Icon: Youtube, label: 'YouTube', href: '#' }]
                .map(({ Icon, label, href }) => (
                  <a key={label} href={href} aria-label={label}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.5)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(149,204,213,.2)'; e.currentTarget.style.color = 'var(--c3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.color = 'rgba(255,255,255,.5)'; }}>
                    <Icon size={14} />
                  </a>
                ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <h3 className="font-extrabold text-xs mb-4 uppercase tracking-[.1em]" style={{ color: 'var(--c3)' }}>Topics</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.topics.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,.5)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--c3)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.5)'}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-extrabold text-xs mb-4 uppercase tracking-[.1em]" style={{ color: 'var(--c3)' }}>Company</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,.5)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--c3)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.5)'}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-extrabold text-xs mb-2 uppercase tracking-[.1em]" style={{ color: 'var(--c3)' }}>Newsletter</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,.5)' }}>
              The best AI insights every week. Free, no spam.
            </p>

            {status === 'success' && (
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#34d399' }}>
                <CheckCircle size={16} /><span>You're in! Check your inbox.</span>
              </div>
            )}
            {status === 'duplicate' && (
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--c3)' }}>
                <CheckCircle size={16} /><span>Already subscribed.</span>
              </div>
            )}
            {status !== 'success' && status !== 'duplicate' && (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required placeholder="your@email.com" aria-label="Email for newsletter"
                  disabled={status === 'loading'}
                  className="text-sm px-4 py-2.5 rounded-lg outline-none transition-colors disabled:opacity-60"
                  style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', color: 'white', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = 'var(--c3)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.15)'}
                />
                {status === 'error' && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: '#f87171' }}>
                    <AlertCircle size={12} />{errorMsg}
                  </div>
                )}
                <button type="submit" disabled={status === 'loading'}
                  className="flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'var(--c3)', color: 'var(--c1)', fontFamily: 'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  {status === 'loading'
                    ? <><Loader2 size={14} className="animate-spin" />Subscribing...</>
                    : <><Mail size={14} /><span>Subscribe Free</span></>}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.3)' }}>
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span>Built with Next.js + Headless WordPress</span>
        </div>
      </div>
    </footer>
  );
}

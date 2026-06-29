'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Twitter, Linkedin, Youtube, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { SITE, FOOTER_LINKS } from '@/config/site';

export default function Footer() {
 const [email, setEmail] = useState('');
 const [status, setStatus] = useState('idle');
 const [errorMsg, setErrorMsg] = useState('');

 async function handleSubscribe(e) {
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
 }

 return (
 <footer>
 <div className="fi2">
 <div className="fg">
 <div>
 <Link href="/" className="logo" style={{ marginBottom: 12 }} aria-label="EverydayOnAI">
 <div className="li"><Zap size={17} fill="white" color="white" /></div>
 <span className="fb3">EverydayOn<em>AI</em></span>
 </Link>
 <p className="fd2">{SITE.description}</p>
 <div className="si">
 {[
 { Icon: Twitter, label: 'Twitter', href: '#' },
 { Icon: Linkedin, label: 'LinkedIn', href: '#' },
 { Icon: Youtube, label: 'YouTube', href: '#' },
 ].map(({ Icon, label, href }) => (
 <a key={label} className="sic" href={href} aria-label={label}><Icon size={14} /></a>
 ))}
 </div>
 </div>

 <div>
 <h3 className="fh">Topics</h3>
 {FOOTER_LINKS.topics.map((l) => <Link key={l.href} href={l.href} className="fa">{l.label}</Link>)}
 </div>

 <div>
 <h3 className="fh">Company</h3>
 {FOOTER_LINKS.company.map((l) => <Link key={l.href} href={l.href} className="fa">{l.label}</Link>)}
 </div>

 <div>
 <h3 className="fh">Newsletter</h3>
 <p className="fd2">The best AI insights every week. Free, no spam.</p>
 {status === 'success' && <div style={{ color: '#86efac', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={15} />You&apos;re in! Check your inbox.</div>}
 {status === 'duplicate' && <div style={{ color: '#95ccd5', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={15} />This email is already subscribed.</div>}
 {status !== 'success' && status !== 'duplicate' && (
 <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
 <input className="nli" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="your@email.com" disabled={status === 'loading'} />
 {status === 'error' && <div style={{ color: '#fca5a5', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}><AlertCircle size={12} />{errorMsg}</div>}
 <button className="nlbtn" type="submit" disabled={status === 'loading'}>
 {status === 'loading' ? <><Loader2 size={14} className="animate-spin" />Subscribing...</> : <><Mail size={14} />Subscribe Free</>}
 </button>
 </form>
 )}
 </div>
 </div>

 <div className="fbot">
 <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
 <span>Built with Next.js + Headless WordPress</span>
 </div>
 </div>
 </footer>
 );
}

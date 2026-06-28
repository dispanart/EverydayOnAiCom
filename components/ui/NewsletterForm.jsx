'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewsletterForm({ buttonLabel = 'Subscribe Free' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
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

  if (status === 'success' || status === 'duplicate') {
    return (
      <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#bbf7d0' }}>
        <CheckCircle size={16} />
        <span>{status === 'success' ? "You're in! Check your inbox." : 'Already subscribed.'}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
        required placeholder="your@email.com" disabled={status === 'loading'}
        className="text-sm px-3.5 py-2.5 rounded-lg outline-none disabled:opacity-60"
        style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', fontFamily: 'inherit' }} />
      {status === 'error' && (
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#fecaca' }}>
          <AlertCircle size={12} />{errorMsg}
        </div>
      )}
      <button type="submit" disabled={status === 'loading'}
        className="flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: '#fff', color: 'var(--c1)' }}>
        {status === 'loading'
          ? <><Loader2 size={14} className="animate-spin" /> Subscribing...</>
          : <><Mail size={14} /> {buttonLabel}</>}
      </button>
    </form>
  );
}

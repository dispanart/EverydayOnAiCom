'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Send, Loader2, CheckCircle, AlertCircle, User } from 'lucide-react';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m} minutes ago`;
  if (h < 24) return `${h} hours ago`;
  if (d < 30) return `${d} days ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function CommentsSection({ slug }) {
  const [comments, setComments]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [form, setForm]           = useState({ name: '', email: '', content: '' });
  const [status, setStatus]       = useState('idle');
  const [errorMsg, setErrorMsg]   = useState('');
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res  = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, slug }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setForm({ name: '', email: '', content: '' });
        setCharCount(0);
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to submit comment.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Connection failed, please try again.');
    }
  };

  return (
    <section className="mt-12 pt-10 border-t border-slate-100" aria-label="Comments">
      <div className="flex items-center gap-2.5 mb-8">
        <MessageCircle size={20} className="text-blue-600" />
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Comments
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-normal text-slate-400">({comments.length})</span>
          )}
        </h2>
      </div>

      <div className="space-y-5 mb-10">
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
            <Loader2 size={15} className="animate-spin" /> Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <MessageCircle size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No comments yet. Be the first!</p>
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200
                             flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={14} className="text-blue-600" />
              </div>
              <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-sm px-4 py-3
                             border border-slate-100 group-hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 text-sm">{c.name}</span>
                  <span className="text-xs text-slate-400">{timeAgo(c.created_at)}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-800 text-base mb-5 flex items-center gap-2">
          <Send size={15} className="text-blue-600" />
          Leave a Comment
        </h3>

        {status === 'success' ? (
          <div className="flex items-start gap-3 text-green-700 bg-green-50 border border-green-200 rounded-xl p-4">
            <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Comment submitted! 🎉</p>
              <p className="text-xs text-green-600 mt-0.5">
                Your comment is awaiting moderator approval and will appear shortly.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required minLength={2} maxLength={60}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             bg-white placeholder:text-slate-400 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Email * <span className="text-slate-400 font-normal normal-case">(not displayed)</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             bg-white placeholder:text-slate-400 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Comment *
              </label>
              <textarea
                value={form.content}
                onChange={(e) => { setForm((f) => ({ ...f, content: e.target.value })); setCharCount(e.target.value.length); }}
                required minLength={5} maxLength={1000} rows={4}
                placeholder="Write your comment here..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-white placeholder:text-slate-400 text-slate-800 resize-none"
              />
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${charCount > 900 ? 'text-red-400' : 'text-slate-400'}`}>
                  {charCount}/1000
                </span>
              </div>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                <AlertCircle size={14} />{errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                         font-semibold text-sm px-6 py-2.5 rounded-xl transition-all
                         hover:shadow-md hover:shadow-blue-200/60 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading'
                ? <><Loader2 size={15} className="animate-spin" />Submitting...</>
                : <><Send size={15} />Post Comment</>
              }
            </button>

            <p className="text-xs text-slate-400">
              Comments will appear after moderator approval.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

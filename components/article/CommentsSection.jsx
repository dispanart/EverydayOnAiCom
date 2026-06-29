'use client';

import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { AlertCircle, CheckCircle, Heart, Loader2, LogOut, MessageCircle, Send, User } from 'lucide-react';

function timeAgo(dateStr) {
 if (!dateStr) return '';
 const timestamp = new Date(dateStr).getTime();
 if (Number.isNaN(timestamp)) return '';
 const diff = Date.now() - timestamp;
 const m = Math.floor(diff / 60000);
 const h = Math.floor(diff / 3600000);
 const d = Math.floor(diff / 86400000);
 if (m < 1) return 'Just now';
 if (m < 60) return `${m} minutes ago`;
 if (h < 24) return `${h} hours ago`;
 if (d < 30) return `${d} days ago`;
 return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getCommentAuthor(comment) {
 return comment.author_name || comment.name || 'Reader';
}

function getCommentDate(comment) {
 return comment.date || comment.created_at;
}

function getCommentContent(comment) {
 const value = comment.content?.rendered || comment.content || '';
 return typeof value === 'string' ? value : '';
}

export default function CommentsSection({ postId }) {
 const { data: session, status: authStatus } = useSession();
 const [comments, setComments] = useState([]);
 const [loading, setLoading] = useState(true);
 const [content, setContent] = useState('');
 const [status, setStatus] = useState('idle');
 const [errorMsg, setErrorMsg] = useState('');
 const [charCount, setCharCount] = useState(0);

 const isLoggedIn = authStatus === 'authenticated' && session?.user?.email;

 useEffect(() => {
 if (!postId) return;
 let active = true;
 setLoading(true);

 fetch(`/api/comments/${postId}`, { cache: 'no-store' })
 .then((r) => r.json())
 .then((d) => {
 if (!active) return;
 setComments(Array.isArray(d.comments) ? d.comments : []);
 })
 .catch(() => {
 if (active) setComments([]);
 })
 .finally(() => {
 if (active) setLoading(false);
 });

 return () => { active = false; };
 }, [postId]);

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!postId || status === 'loading') return;
 setStatus('loading');
 setErrorMsg('');

 try {
 const res = await fetch(`/api/comments/${postId}`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ content }),
 });
 const data = await res.json();

 if (res.ok && data.ok) {
 setStatus('success');
 setContent('');
 setCharCount(0);
 } else {
 setStatus('error');
 setErrorMsg(data.message || data.error || 'Failed to submit comment.');
 }
 } catch {
 setStatus('error');
 setErrorMsg('Connection failed, please try again.');
 }
 };

 const handleCommentLike = async (commentId) => {
 if (!commentId) return;
 const previous = comments;
 setComments((items) => items.map((comment) => (
 comment.id === commentId
 ? { ...comment, likes: Number(comment.likes || 0) + 1 }
 : comment
 )));

 try {
 const res = await fetch('/api/comment-like', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ comment_id: commentId }),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.message || 'Failed');
 setComments((items) => items.map((comment) => (
 comment.id === commentId
 ? { ...comment, likes: Number(data.likes || 0) }
 : comment
 )));
 } catch {
 setComments(previous);
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
 <p className="text-sm">No approved comments yet.</p>
 </div>
 ) : (
 comments.map((comment) => (
 <div key={comment.id} className="flex gap-3 group">
 <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
 <User size={14} className="text-blue-600" />
 </div>
 <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-100 group-hover:border-slate-200 transition-colors">
 <div className="flex items-center justify-between gap-3 mb-1.5">
 <span className="font-bold text-slate-800 text-sm">{getCommentAuthor(comment)}</span>
 <span className="text-xs text-slate-400">{timeAgo(getCommentDate(comment))}</span>
 </div>
 <div
 className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap"
 dangerouslySetInnerHTML={{ __html: getCommentContent(comment) }}
 />
 <button
 type="button"
 onClick={() => handleCommentLike(comment.id)}
 className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
 aria-label="Like this comment"
 >
 <Heart size={13} />
 {Number(comment.likes || 0).toLocaleString('en-US')}
 </button>
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
 <p className="font-semibold text-sm">Comment submitted for review.</p>
 <p className="text-xs text-green-600 mt-0.5">
 Your comment will appear after it is approved in WordPress.
 </p>
 <button
 type="button"
 onClick={() => setStatus('idle')}
 className="mt-3 text-xs font-bold text-green-700 underline"
 >
 Write another comment
 </button>
 </div>
 </div>
 ) : authStatus === 'loading' ? (
 <div className="flex items-center gap-2 text-slate-400 text-sm">
 <Loader2 size={15} className="animate-spin" /> Checking login...
 </div>
 ) : !isLoggedIn ? (
 <div className="space-y-4">
 <p className="text-sm text-slate-500">
 Login with Google before commenting. Your comment will be reviewed in WordPress before it appears.
 </p>
 <button
 type="button"
 onClick={() => signIn('google')}
 className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all hover:shadow-md hover:shadow-blue-200/60"
 >
 Continue with Google
 </button>
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
 <div className="min-w-0">
 <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Commenting as</p>
 <p className="truncate text-sm font-bold text-slate-800">{session.user.name || session.user.email}</p>
 </div>
 <button
 type="button"
 onClick={() => signOut()}
 className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700"
 >
 <LogOut size={13} /> Sign out
 </button>
 </div>

 <div>
 <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
 Comment *
 </label>
 <textarea
 value={content}
 onChange={(e) => { setContent(e.target.value); setCharCount(e.target.value.length); }}
 required
 minLength={5}
 maxLength={1000}
 rows={4}
 placeholder="Write your comment here..."
 className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-slate-400 text-slate-800 resize-none"
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
 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all hover:shadow-md hover:shadow-blue-200/60 disabled:opacity-60 disabled:cursor-not-allowed"
 >
 {status === 'loading'
 ? <><Loader2 size={15} className="animate-spin" />Submitting...</>
 : <><Send size={15} />Submit for Review</>
 }
 </button>
 </form>
 )}
 </div>
 </section>
 );
}

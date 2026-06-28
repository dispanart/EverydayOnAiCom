'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, MessageSquare, Heart, TrendingUp,
  Bell, LogOut, CheckCircle, XCircle, Trash2,
  Loader2, Send, Users, RefreshCw, Eye
} from 'lucide-react';

// ── Tabs ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',  label: 'Overview',   Icon: LayoutDashboard },
  { id: 'comments',  label: 'Comments',   Icon: MessageSquare },
  { id: 'trending',  label: 'Trending',   Icon: TrendingUp },
  { id: 'push',      label: 'Push Notif', Icon: Bell },
];

// ── Helper ────────────────────────────────────────────────────────
function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60)   return `${s}d lalu`;
  if (s < 3600) return `${Math.floor(s/60)}m lalu`;
  if (s < 86400)return `${Math.floor(s/3600)}j lalu`;
  return `${Math.floor(s/86400)} days ago`;
}

export default function AdminPage() {
  const router = useRouter();
  const [tab,         setTab]         = useState('overview');
  const [authed,      setAuthed]      = useState(false);
  const [checking,    setChecking]    = useState(true);
  const [loginForm,   setLoginForm]   = useState({ u: '', p: '' });
  const [loginErr,    setLoginErr]    = useState('');
  const [loginLoading,setLoginLoading]= useState(false);

  // Data states
  const [stats,       setStats]       = useState(null);
  const [comments,    setComments]    = useState([]);
  const [pending,     setPending]     = useState([]);
  const [trending,    setTrending]    = useState([]);
  const [pushTitle,   setPushTitle]   = useState('');
  const [pushBody,    setPushBody]    = useState('');
  const [pushUrl,     setPushUrl]     = useState('');
  const [pushSending, setPushSending] = useState(false);
  const [pushResult,  setPushResult]  = useState('');
  const [loading,     setLoading]     = useState(false);

  // Check auth
  useEffect(() => {
    fetch('/api/admin/check').then(r => {
      setAuthed(r.ok);
      setChecking(false);
    }).catch(() => setChecking(false));
  }, []);

  // Load data when authed
  useEffect(() => {
    if (!authed) return;
    loadAll();
  }, [authed]);

  async function loadAll() {
    setLoading(true);
    const [statsR, commentsR, trendingR] = await Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/admin/comments').then(r => r.json()),
      fetch('/api/admin/trending').then(r => r.json()),
    ]);
    setStats(statsR);
    setComments(commentsR.approved || []);
    setPending(commentsR.pending || []);
    setTrending(trendingR.trending || []);
    setLoading(false);
  }

  async function login(e) {
    e.preventDefault();
    setLoginLoading(true); setLoginErr('');
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginForm.u, password: loginForm.p }),
    });
    if (r.ok) { setAuthed(true); }
    else { setLoginErr('Username atau password salah.'); }
    setLoginLoading(false);
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
  }

  async function approveComment(id) {
    await fetch(`/api/admin/comments/${id}/approve`, { method: 'POST' });
    setPending(p => p.filter(c => c.id !== id));
    loadAll();
  }

  async function deleteComment(id, approved) {
    await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
    if (approved) setComments(c => c.filter(x => x.id !== id));
    else setPending(c => c.filter(x => x.id !== id));
  }

  async function sendPush(e) {
    e.preventDefault();
    setPushSending(true); setPushResult('');
    const r = await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: pushTitle, body: pushBody, url: pushUrl }),
    });
    const d = await r.json();
    setPushResult(d.message || (r.ok ? 'Sent!' : 'Failed'));
    setPushSending(false);
  }

  // ── Login screen ─────────────────────────────────────────────
  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl border border-slate-800 p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <span className="text-white font-bold">EverydayOnAI Admin</span>
        </div>
        <form onSubmit={login} className="space-y-4">
          <input type="text" placeholder="Username" value={loginForm.u}
            onChange={e => setLoginForm(f => ({...f, u: e.target.value}))}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700
                       focus:outline-none focus:border-blue-500 text-sm placeholder:text-slate-500" />
          <input type="password" placeholder="Password" value={loginForm.p}
            onChange={e => setLoginForm(f => ({...f, p: e.target.value}))}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700
                       focus:outline-none focus:border-blue-500 text-sm placeholder:text-slate-500" />
          {loginErr && <p className="text-red-400 text-sm">{loginErr}</p>}
          <button type="submit" disabled={loginLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl
                       transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loginLoading ? <Loader2 size={16} className="animate-spin" /> : null}
            Login
          </button>
        </form>
      </div>
    </div>
  );

  // ── Dashboard ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={13} className="text-white" />
            </div>
            <span className="font-bold text-sm">EAI Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${tab === id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Icon size={15} />{label}
              {id === 'comments' && pending.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400
                       hover:bg-slate-800 hover:text-white transition-colors">
            <LogOut size={15} />Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold capitalize">{tab}</h1>
          <button onClick={loadAll} disabled={loading}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />Refresh
          </button>
        </div>

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Likes',      val: stats?.totalLikes      ?? '...', Icon: Heart,         color: 'text-red-400' },
                { label: 'Total Comments',   val: stats?.totalComments   ?? '...', Icon: MessageSquare, color: 'text-blue-400' },
                { label: 'Pending Approval', val: stats?.pendingComments ?? '...', Icon: Eye,           color: 'text-yellow-400' },
                { label: 'Subscribers Push', val: stats?.pushSubscribers ?? '...', Icon: Bell,          color: 'text-green-400' },
              ].map(({ label, val, Icon, color }) => (
                <div key={label} className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
                  <Icon size={18} className={`${color} mb-3`} />
                  <p className="text-2xl font-extrabold text-white">{val}</p>
                  <p className="text-slate-400 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
              <h3 className="font-bold mb-4 text-slate-300 text-sm uppercase tracking-wider">Quick Links</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: '← Back to Website', href: '/' },
                  { label: 'Supabase Dashboard',    href: 'https://supabase.com/dashboard' },
                  { label: 'Vercel Dashboard',       href: 'https://vercel.com' },
                  { label: 'WordPress Admin',        href: 'https://wp.everydayonai.com/dpadmin' },
                ].map(l => (
                  <a key={l.href} href={l.href} target={l.href.startsWith('http') ? '_blank' : '_self'}
                     className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Comments ── */}
        {tab === 'comments' && (
          <div className="space-y-6">
            {/* Pending */}
            <div>
              <h2 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <Eye size={15} />Menunggu Persetujuan ({pending.length})
              </h2>
              {pending.length === 0
                ? <p className="text-slate-500 text-sm">No pending comments.</p>
                : <div className="space-y-3">
                    {pending.map(c => (
                      <div key={c.id} className="bg-slate-900 border border-yellow-900/40 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white text-sm">{c.name}</span>
                              <span className="text-slate-500 text-xs">{c.email}</span>
                              <span className="text-slate-600 text-xs">{timeAgo(c.created_at)}</span>
                            </div>
                            <p className="text-slate-300 text-sm">{c.content}</p>
                            <a href={`/${c.slug}`} target="_blank"
                               className="text-blue-400 text-xs mt-1 inline-block hover:underline">
                              /{c.slug}
                            </a>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => approveComment(c.id)}
                              className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors" title="Approve">
                              <CheckCircle size={15} />
                            </button>
                            <button onClick={() => deleteComment(c.id, false)}
                              className="p-2 bg-red-600/80 hover:bg-red-700 rounded-lg transition-colors" title="Hapus">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>

            {/* Approved */}
            <div>
              <h2 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle size={15} />Disetujui ({comments.length})
              </h2>
              {comments.length === 0
                ? <p className="text-slate-500 text-sm">No approved comments yet.</p>
                : <div className="space-y-2">
                    {comments.map(c => (
                      <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-white text-sm">{c.name}</span>
                            <span className="text-slate-600 text-xs">{timeAgo(c.created_at)}</span>
                            <a href={`/${c.slug}`} target="_blank" className="text-blue-400 text-xs hover:underline">/{c.slug}</a>
                          </div>
                          <p className="text-slate-400 text-sm truncate">{c.content}</p>
                        </div>
                        <button onClick={() => deleteComment(c.id, true)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}

        {/* ── Trending ── */}
        {tab === 'trending' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-400" />
              <h2 className="font-bold">Artikel Paling Banyak Disukai</h2>
            </div>
            {trending.length === 0
              ? <p className="p-6 text-slate-500 text-sm">No like data yet.</p>
              : <div className="divide-y divide-slate-800">
                  {trending.map((t, i) => (
                    <div key={t.slug} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/50 transition-colors">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                        ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-slate-400 text-black' : i === 2 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <a href={`/${t.slug}`} target="_blank"
                           className="text-white text-sm font-medium hover:text-blue-400 transition-colors truncate block">
                          /{t.slug}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 text-red-400 font-bold text-sm flex-shrink-0">
                        <Heart size={13} className="fill-red-400" />{t.count}
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ── Push Notifications ── */}
        {tab === 'push' && (
          <div className="max-w-lg space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h2 className="font-bold mb-5 flex items-center gap-2">
                <Bell size={16} className="text-blue-400" />
                Send Push Notification
              </h2>
              <form onSubmit={sendPush} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Judul *</label>
                  <input value={pushTitle} onChange={e => setPushTitle(e.target.value)} required
                    placeholder="Artikel baru: ..."
                    className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700
                               focus:outline-none focus:border-blue-500 text-sm placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Pesan *</label>
                  <textarea value={pushBody} onChange={e => setPushBody(e.target.value)} required rows={3}
                    placeholder="Deskripsi singkat artikel..."
                    className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700
                               focus:outline-none focus:border-blue-500 text-sm placeholder:text-slate-600 resize-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">URL Tujuan</label>
                  <input value={pushUrl} onChange={e => setPushUrl(e.target.value)}
                    placeholder="https://everydayonai.com/nama-artikel"
                    className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700
                               focus:outline-none focus:border-blue-500 text-sm placeholder:text-slate-600" />
                </div>
                {pushResult && (
                  <p className={`text-sm font-medium ${pushResult.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                    {pushResult}
                  </p>
                )}
                <button type="submit" disabled={pushSending}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold
                             px-6 py-3 rounded-xl transition-colors disabled:opacity-60">
                  {pushSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  Send to All Subscribers
                </button>
              </form>
            </div>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
              <p className="text-slate-400 text-sm">
                <span className="text-white font-semibold">{stats?.pushSubscribers ?? 0}</span> subscriber aktif
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import { stripHtmlAndDecode } from '@/lib/wordpress';

export default function HeroSection({ post }) {
  const canvasRef = useRef(null);
  const miniCanvasRef = useRef(null);

  // Big neural network background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [], packets = [], raf;

    function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
    resize();

    function init() {
      nodes = [];
      const N = Math.min(55, Math.floor((W * H) / 12000));
      for (let i = 0; i < N; i++) nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
        r: Math.random() * 2.2 + 1, p: Math.random() * Math.PI * 2,
      });
    }
    init();

    function addPacket() {
      if (packets.length < 10 && Math.random() < .025 && nodes.length > 1) {
        const a = Math.floor(Math.random() * nodes.length);
        const b = Math.floor(Math.random() * nodes.length);
        if (a !== b) packets.push({ a, b, t: 0, s: .007 + Math.random() * .01 });
      }
    }

    function draw() {
      raf = requestAnimationFrame(draw);
      if (canvas.offsetWidth !== W) { resize(); init(); }
      ctx.clearRect(0, 0, W, H);

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.p += .018;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(149,204,213,${(1 - d / 130) * .38})`; ctx.lineWidth = .7; ctx.stroke();
          }
        }
      }

      addPacket(); packets = packets.filter(p => p.t < 1);
      packets.forEach(p => {
        p.t += p.s;
        const na = nodes[p.a], nb = nodes[p.b];
        const px = na.x + (nb.x - na.x) * p.t, py = na.y + (nb.y - na.y) * p.t;
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,.82)'; ctx.fill();
        const t2 = Math.max(0, p.t - .06);
        ctx.beginPath(); ctx.moveTo(na.x + (nb.x - na.x) * t2, na.y + (nb.y - na.y) * t2); ctx.lineTo(px, py);
        ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1.5; ctx.stroke();
      });

      nodes.forEach(n => {
        const pl = .5 + .5 * Math.sin(n.p);
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        g.addColorStop(0, `rgba(149,204,213,${.12 * pl})`); g.addColorStop(1, 'rgba(149,204,213,0)');
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${.55 + .45 * pl})`; ctx.fill();
      });

      const t = Date.now() / 4000, cx = W / 2, cy = H / 2;
      for (let row = -3; row <= 3; row++) {
        for (let col = -6; col <= 6; col++) {
          const hx = cx + col * 68 + (row % 2 === 0 ? 34 : 0) + Math.sin(t + col * .3) * 7;
          const hy = cy + row * 58 + Math.cos(t * .7 + row * .3) * 5;
          const sc = .65 + .35 * Math.sin(t * .5 + col * .2 + row * .15);
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i - Math.PI / 6;
            const px2 = hx + 28 * sc * Math.cos(a), py2 = hy + 28 * sc * Math.sin(a);
            i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
          }
          ctx.closePath(); ctx.strokeStyle = `rgba(221,238,240,${.038 * sc})`; ctx.lineWidth = .6; ctx.stroke();
        }
      }
    }
    draw();

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (!e.isIntersecting) cancelAnimationFrame(raf); else draw(); });
    });
    obs.observe(canvas);

    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(canvas);

    return () => { cancelAnimationFrame(raf); obs.disconnect(); ro.disconnect(); };
  }, []);

  // Small neural network inside the featured card
  useEffect(() => {
    const c = miniCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const n = [];
    for (let i = 0; i < 28; i++) n.push({
      x: Math.random() * 560, y: Math.random() * 315,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
    });
    let raf;
    function draw() {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, 560, 315);
      n.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 560) p.vx *= -1;
        if (p.y < 0 || p.y > 315) p.vy *= -1;
      });
      for (let i = 0; i < n.length; i++) {
        for (let j = i + 1; j < n.length; j++) {
          const dx = n[i].x - n[j].x, dy = n[i].y - n[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(n[i].x, n[i].y); ctx.lineTo(n[j].x, n[j].y);
            ctx.strokeStyle = `rgba(149,204,213,${(1 - d / 110) * .45})`; ctx.lineWidth = .6; ctx.stroke();
          }
        }
      }
      n.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,.65)'; ctx.fill();
      });
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const excerpt = post ? stripHtmlAndDecode(post.excerpt).slice(0, 140) : null;
  const dateLabel = post
    ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <section className="relative overflow-hidden" aria-label="Hero"
      style={{ background: 'linear-gradient(135deg,#1a2560,#293581,#2a5ac8,#4274d9)', padding: '50px 20px 44px' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: .35, pointerEvents: 'none' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full mb-4"
              style={{ background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)' }}>
              <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#95ccd5', animation: 'pulse 2s ease-in-out infinite' }} />
              <span className="text-[10.5px] font-bold uppercase tracking-[.08em]" style={{ color: '#ddeef0' }}>
                Updated Daily
              </span>
            </div>

            <h1 className="font-black text-white mb-3.5"
              style={{ fontSize: 'clamp(28px, 4.2vw, 40px)', lineHeight: 1.12, letterSpacing: '-.03em' }}>
              Stay Ahead of <em style={{ fontStyle: 'normal', color: '#95ccd5' }}>AI</em>,<br />Every Single Day.
            </h1>

            <p className="text-[15.5px] leading-[1.65] mb-6" style={{ color: 'rgba(255,255,255,.72)', maxWidth: '450px' }}>
              Practical insights on AI tools, business strategy, creativity, and everyday use — curated for founders, marketers, and curious minds.
            </p>

            <div className="flex gap-2.5 flex-wrap mb-6">
              <Link href="/subscribe"
                className="inline-flex items-center gap-1.5 px-5.5 py-2.5 rounded-[20px] font-extrabold text-[13.5px] transition-transform hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,#fff,#ddeef0)', color: 'var(--c1)', boxShadow: '0 3px 14px rgba(0,0,0,.15)' }}>
                <Mail size={13} /> Subscribe Free
              </Link>
              <Link href="/articles"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[20px] font-bold text-[13.5px] text-white transition-colors hover:bg-[rgba(255,255,255,.2)]"
                style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.22)' }}>
                Explore Articles <ArrowRight size={13} />
              </Link>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <div className="text-[21px] font-black text-white">50K+</div>
                <div className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,.5)' }}>Readers</div>
              </div>
              <div className="w-px h-8" style={{ background: 'rgba(255,255,255,.15)' }} />
              <div>
                <div className="text-[21px] font-black text-white">500+</div>
                <div className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,.5)' }}>Articles</div>
              </div>
              <div className="w-px h-8" style={{ background: 'rgba(255,255,255,.15)' }} />
              <div>
                <div className="text-[21px] font-black text-white">Weekly</div>
                <div className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,.5)' }}>Newsletter</div>
              </div>
            </div>
          </div>

          {/* Right: featured post card */}
          {post && (
            <Link href={`/${post.slug}`}
              className="block rounded-[18px] overflow-hidden transition-transform hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(8px)', boxShadow: '0 16px 40px rgba(0,0,0,.2)' }}>
              <div className="relative w-full aspect-video" style={{ background: 'linear-gradient(135deg,#1a2a6c,#1e3fae)' }}>
                <canvas ref={miniCanvasRef} width={560} height={315}
                  className="absolute inset-0 w-full h-full" style={{ opacity: .45 }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(8,14,32,.88),rgba(8,14,32,.1) 60%,transparent)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-[.06em] text-white mb-2"
                    style={{ background: '#22c55e' }}>
                    ● New
                  </span>
                  <div className="text-base font-extrabold text-white leading-[1.35] mb-2 line-clamp-2">
                    {post.title}
                  </div>
                  <div className="text-[11.5px]" style={{ color: 'rgba(255,255,255,.5)' }}>
                    Published {dateLabel} · {excerpt ? `${Math.max(3, Math.round(excerpt.length / 200) + 3)} min read` : ''}
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

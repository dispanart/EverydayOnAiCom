'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { stripHtmlAndDecode } from '@/lib/wordpress';
import { DateMeta } from '@/components/ui';

export default function HeroSection({ post }) {
  const canvasRef = useRef(null);

  // 3D Neural network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [], packets = [], raf;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();

    function init() {
      nodes = [];
      const N = Math.min(50, Math.floor((W * H) / 14000));
      for (let i = 0; i < N; i++) nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
        r: Math.random() * 2 + 1, p: Math.random() * Math.PI * 2
      });
    }
    init();

    function addPacket() {
      if (packets.length < 8 && Math.random() < .02 && nodes.length > 1) {
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

      // Connections
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

      // Packets
      addPacket(); packets = packets.filter(p => p.t < 1);
      packets.forEach(p => {
        p.t += p.s;
        const na = nodes[p.a], nb = nodes[p.b];
        const px = na.x + (nb.x - na.x) * p.t, py = na.y + (nb.y - na.y) * p.t;
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fill();
        const t2 = Math.max(0, p.t - .06);
        ctx.beginPath(); ctx.moveTo(na.x + (nb.x - na.x) * t2, na.y + (nb.y - na.y) * t2); ctx.lineTo(px, py);
        ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1.5; ctx.stroke();
      });

      // Nodes
      nodes.forEach(n => {
        const pl = .5 + .5 * Math.sin(n.p);
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        g.addColorStop(0, `rgba(149,204,213,${.12 * pl})`); g.addColorStop(1, 'rgba(149,204,213,0)');
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${.55 + .45 * pl})`; ctx.fill();
      });

      // Hex grid overlay
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

  if (!post) {
    return (
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1a2560,#293581 40%,#2a5ac8 70%,#4274d9)', padding: '52px 20px 48px' }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: .35 }} />
        <div className="max-w-7xl mx-auto relative z-10 text-center" style={{ color: 'white' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#95ccd5' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ddeef0' }}>Updated Daily</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-4" style={{ letterSpacing: '-.03em' }}>
            Stay Ahead of <em style={{ fontStyle: 'normal', color: '#95ccd5' }}>AI</em>, Every Day.
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,.7)' }}>
            Practical AI insights for business, tools, creativity, and everyday life.
          </p>
        </div>
      </section>
    );
  }

  const category = post.categories?.nodes?.[0];
  const img = post.featuredImage?.node;
  const excerpt = stripHtmlAndDecode(post.excerpt).slice(0, 180);

  return (
    <section className="relative overflow-hidden" aria-label="Featured article"
      style={{ background: 'linear-gradient(135deg,#1a2560,#293581 40%,#2a5ac8 70%,#4274d9)', padding: '52px 20px 48px' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: .35, pointerEvents: 'none' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text */}
          <div className="order-2 lg:order-1">
            {/* Updated Daily badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
              style={{ background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#95ccd5', boxShadow: '0 0 0 0 rgba(149,204,213,.5)', animation: 'pulse 2s ease-in-out infinite' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ddeef0' }}>Updated Daily</span>
            </div>

            {category && (
              <Link href={`/category/${category.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 transition-all"
                style={{ background: 'rgba(149,204,213,.2)', color: '#ddeef0', border: '1px solid rgba(149,204,213,.35)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(149,204,213,.3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(149,204,213,.2)'}>
                {category.name}
              </Link>
            )}

            <h1 className="font-black leading-tight mb-5 text-white"
              style={{ fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-.03em', lineHeight: 1.12 }}>
              {post.title}
            </h1>

            {excerpt && (
              <p className="text-lg leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,.72)', maxWidth: '460px' }}>
                {excerpt}
              </p>
            )}

            <div className="flex items-center gap-4 mb-8 flex-wrap">
              {post.author?.node?.name && (
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,.65)' }}>
                  By {post.author.node.name}
                </span>
              )}
              <DateMeta post={post} className="text-sm" />
            </div>

            <Link href={`/${post.slug}`}
              className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,rgba(255,255,255,.95),#ddeef0)', color: 'var(--c1)', boxShadow: '0 4px 16px rgba(0,0,0,.2)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.3)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.2)'}>
              Read Article <ArrowRight size={16} />
            </Link>
          </div>

          {/* Featured image */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 24px 60px rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.15)' }}>
              {img?.sourceUrl ? (
                <Image src={img.sourceUrl} alt={img.altText || post.title} fill priority
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,rgba(66,116,217,.3),rgba(149,204,213,.2))' }}>
                  <span className="font-black text-8xl select-none" style={{ color: 'rgba(255,255,255,.15)' }}>AI</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

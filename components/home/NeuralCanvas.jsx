'use client';

import { useEffect, useRef } from 'react';

export default function NeuralCanvas({ id = 'neural', mini = false }) {
 const canvasRef = useRef(null);

 useEffect(() => {
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext('2d');
 let raf = 0;
 let W = 0;
 let H = 0;
 let nodes = [];
 let packets = [];

 const resize = () => {
 const rect = canvas.getBoundingClientRect();
 W = canvas.width = Math.max(1, Math.floor(rect.width || (mini ? 560 : window.innerWidth)));
 H = canvas.height = Math.max(1, Math.floor(rect.height || (mini ? 315 : 360)));
 };

 const init = () => {
 resize();
 nodes = [];
 const count = mini ? 28 : Math.min(55, Math.floor((W * H) / 12000));
 for (let i = 0; i < count; i++) {
 nodes.push({
 x: Math.random() * W,
 y: Math.random() * H,
 vx: (Math.random() - 0.5) * (mini ? 0.35 : 0.45),
 vy: (Math.random() - 0.5) * (mini ? 0.35 : 0.45),
 r: Math.random() * 2.2 + 1,
 p: Math.random() * Math.PI * 2,
 });
 }
 };

 const addPacket = () => {
 if (mini) return;
 if (packets.length < 10 && Math.random() < 0.025 && nodes.length > 1) {
 const a = Math.floor(Math.random() * nodes.length);
 const b = Math.floor(Math.random() * nodes.length);
 if (a !== b) packets.push({ a, b, t: 0, s: 0.007 + Math.random() * 0.01 });
 }
 };

 const draw = () => {
 raf = requestAnimationFrame(draw);
 ctx.clearRect(0, 0, W, H);
 nodes.forEach((n) => {
 n.x += n.vx;
 n.y += n.vy;
 n.p += 0.018;
 if (n.x < 0 || n.x > W) n.vx *= -1;
 if (n.y < 0 || n.y > H) n.vy *= -1;
 });

 const maxDistance = mini ? 110 : 130;
 for (let i = 0; i < nodes.length; i++) {
 for (let j = i + 1; j < nodes.length; j++) {
 const dx = nodes[i].x - nodes[j].x;
 const dy = nodes[i].y - nodes[j].y;
 const d = Math.sqrt(dx * dx + dy * dy);
 if (d < maxDistance) {
 ctx.beginPath();
 ctx.moveTo(nodes[i].x, nodes[i].y);
 ctx.lineTo(nodes[j].x, nodes[j].y);
 ctx.strokeStyle = `rgba(149,204,213,${(1 - d / maxDistance) * (mini ? 0.45 : 0.38)})`;
 ctx.lineWidth = mini ? 0.6 : 0.7;
 ctx.stroke();
 }
 }
 }

 addPacket();
 packets = packets.filter((p) => p.t < 1);
 packets.forEach((p) => {
 p.t += p.s;
 const na = nodes[p.a];
 const nb = nodes[p.b];
 if (!na || !nb) return;
 const px = na.x + (nb.x - na.x) * p.t;
 const py = na.y + (nb.y - na.y) * p.t;
 ctx.beginPath();
 ctx.arc(px, py, 2.5, 0, Math.PI * 2);
 ctx.fillStyle = 'rgba(255,255,255,.82)';
 ctx.fill();
 const t2 = Math.max(0, p.t - 0.06);
 ctx.beginPath();
 ctx.moveTo(na.x + (nb.x - na.x) * t2, na.y + (nb.y - na.y) * t2);
 ctx.lineTo(px, py);
 ctx.strokeStyle = 'rgba(255,255,255,.28)';
 ctx.lineWidth = 1.5;
 ctx.stroke();
 });

 nodes.forEach((n) => {
 const pulse = 0.5 + 0.5 * Math.sin(n.p);
 if (!mini) {
 const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
 g.addColorStop(0, `rgba(149,204,213,${0.12 * pulse})`);
 g.addColorStop(1, 'rgba(149,204,213,0)');
 ctx.beginPath();
 ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
 ctx.fillStyle = g;
 ctx.fill();
 }
 ctx.beginPath();
 ctx.arc(n.x, n.y, mini ? 1.8 : n.r, 0, Math.PI * 2);
 ctx.fillStyle = `rgba(255,255,255,${mini ? 0.65 : 0.55 + 0.45 * pulse})`;
 ctx.fill();
 });

 if (!mini) {
 const t = Date.now() / 4000;
 const cx = W / 2;
 const cy = H / 2;
 for (let r = -3; r <= 3; r++) {
 for (let c = -6; c <= 6; c++) {
 const hx = cx + c * 68 + (r % 2 === 0 ? 34 : 0) + Math.sin(t + c * 0.3) * 7;
 const hy = cy + r * 58 + Math.cos(t * 0.7 + r * 0.3) * 5;
 const sc = 0.65 + 0.35 * Math.sin(t * 0.5 + c * 0.2 + r * 0.15);
 ctx.beginPath();
 for (let i = 0; i < 6; i++) {
 const a = (Math.PI / 3) * i - Math.PI / 6;
 const px = hx + 28 * sc * Math.cos(a);
 const py = hy + 28 * sc * Math.sin(a);
 i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
 }
 ctx.closePath();
 ctx.strokeStyle = `rgba(221,238,240,${0.038 * sc})`;
 ctx.lineWidth = 0.6;
 ctx.stroke();
 }
 }
 }
 };

 init();
 draw();
 const onResize = () => init();
 window.addEventListener('resize', onResize);
 return () => {
 cancelAnimationFrame(raf);
 window.removeEventListener('resize', onResize);
 };
 }, [mini]);

 return <canvas id={id} ref={canvasRef} width={mini ? 560 : undefined} height={mini ? 315 : undefined} style={mini ? { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.45, zIndex: 0 } : undefined} />;
}

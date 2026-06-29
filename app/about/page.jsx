import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE } from '@/config/site';

export const metadata = {
 title: `About ${SITE.name}`,
 description: 'Learn about EverydayOnAI, an independent AI publication focused on practical AI, governance, tools, and trustworthy analysis.',
};

const focusAreas = [
 {
 icon: ShieldCheck,
 title: 'AI Governance',
 text: 'Clear explainers on AI governance, risk management, EU AI Act readiness, enterprise policy, and operational compliance.',
 },
 {
 icon: Sparkles,
 title: 'AI Tools',
 text: 'Practical coverage of AI tools for research, writing, automation, productivity, and business workflows.',
 },
 {
 icon: BookOpen,
 title: 'Actionable Guides',
 text: 'Step-by-step articles designed to help readers understand what to do next, not just what is trending.',
 },
];

const standards = [
 'We prioritize clarity, source quality, and practical usefulness.',
 'We separate explainers, opinions, and recommendations clearly.',
 'We update high-impact articles when policies, tools, or market conditions change.',
 'We avoid inflated claims and focus on real-world AI adoption, risk, and value.',
];

export default function AboutPage() {
 return (
 <>
 <Header />
 <main>
 <section className="apg">
 <div className="w">
 <span className="chip c2" style={{ marginBottom: 14 }}>About EverydayOnAI</span>
 <h1>AI insight for people building, using, and governing AI.</h1>
 <p>
 EverydayOnAI is an independent AI publication covering practical AI adoption,
 AI governance, tools, policy, and responsible innovation for readers who want
 clear answers without hype.
 </p>
 </div>
 </section>

 <section className="w" style={{ paddingTop: 34, paddingBottom: 52 }}>
 <div className="al" style={{ alignItems: 'start' }}>
 <article>
 <div className="wid" style={{ marginBottom: 24 }}>
 <h2 style={{ marginTop: 0 }}>Our Mission</h2>
 <p>
 Our mission is to make AI understandable, useful, and accountable. We publish
 articles that help professionals, creators, operators, and curious readers
 understand how AI systems work, how they are regulated, and how they can be
 used responsibly in real workflows.
 </p>
 <p>
 EverydayOnAI focuses on the intersection of AI capability and AI responsibility:
 tools that improve productivity, policies that reduce risk, and governance
 practices that turn abstract principles into operational readiness.
 </p>
 </div>

 <div className="agrid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginBottom: 28 }}>
 {focusAreas.map(({ icon: Icon, title, text }) => (
 <div className="wid" key={title} style={{ margin: 0 }}>
 <div className="wt"><Icon size={12} />{title}</div>
 <p style={{ marginBottom: 0 }}>{text}</p>
 </div>
 ))}
 </div>

 <div className="wid">
 <h2 style={{ marginTop: 0 }}>Editorial Standards</h2>
 <div style={{ display: 'grid', gap: 12 }}>
 {standards.map((item) => (
 <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
 <CheckCircle2 size={18} color="var(--c2)" style={{ marginTop: 2, flexShrink: 0 }} />
 <span>{item}</span>
 </div>
 ))}
 </div>
 </div>
 </article>

 <aside className="sid">
 <div className="wid" style={{ textAlign: 'center' }}>
 <Image
 src="/authors/dispa-ai-buff-author-photo.webp"
 alt="Dispa - The AI Buff"
 width={128}
 height={128}
 style={{ borderRadius: '50%', objectFit: 'cover', margin: '0 auto 14px', border: '4px solid rgba(66,116,217,.18)' }}
 />
 <h2 style={{ margin: '0 0 6px' }}>Dispa - The AI Buff</h2>
 <p style={{ marginTop: 0 }}>
 Editor and operator behind EverydayOnAI, focused on practical AI literacy,
 AI governance, and building a trusted AI media resource.
 </p>
 <Link className="ttb" href="/about/dispa">Read Author Profile</Link>
 </div>

 <div className="wid">
 <div className="wt">Contact</div>
 <p>For questions, corrections, partnerships, or editorial inquiries:</p>
 <a href={`mailto:${SITE.email}`} style={{ fontWeight: 800, color: 'var(--c2)' }}>{SITE.email}</a>
 </div>
 </aside>
 </div>
 </section>
 </main>
 <Footer />
 </>
 );
}

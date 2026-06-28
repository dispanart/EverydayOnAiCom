import { Bot, Briefcase, Palette, Newspaper } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import NewsletterForm from '@/components/ui/NewsletterForm';
import { SITE } from '@/config/site';

export const metadata = {
  title: 'About Us',
  description: 'Making artificial intelligence accessible, practical, and relevant for everyone.',
};

const COVERAGE = [
  { Icon: Bot, title: 'AI Tools & Reviews', desc: 'Honest, in-depth testing of the latest AI tools' },
  { Icon: Briefcase, title: 'Business Strategy', desc: 'How to use AI to grow and scale your business' },
  { Icon: Palette, title: 'Creative AI', desc: 'AI for writing, art, music, and design' },
  { Icon: Newspaper, title: 'AI News & Trends', desc: 'Weekly roundups of the most important AI developments' },
];

const STATS = [
  { value: '50K+', label: 'Monthly Readers' },
  { value: '500+', label: 'Published Articles' },
  { value: '12K+', label: 'Newsletter Subs' },
  { value: '32', label: 'Countries Reached' },
];

export default function AboutPage() {
  return (
    <PageWrapper>
      <main className="min-h-screen" style={{ background: 'var(--bg)' }}>

        {/* Gradient header */}
        <div style={{ background: 'linear-gradient(135deg,var(--c1),var(--c2))', padding: '52px 20px', color: '#fff' }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-[30px] font-black mb-2.5">About {SITE.name}</h1>
            <p className="text-[15px]" style={{ color: 'rgba(255,255,255,.72)', maxWidth: '540px' }}>
              Making artificial intelligence accessible, practical, and relevant for everyone.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-11">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Left: mission + coverage */}
            <div>
              <h2 className="text-[22px] font-extrabold mb-3.5" style={{ color: 'var(--tp)' }}>Our Mission</h2>
              <p className="text-[14.5px] leading-[1.75] mb-4" style={{ color: 'var(--ts)' }}>
                {SITE.name} was founded with a simple belief: the AI revolution should benefit everyone, not just
                developers and tech insiders. We translate complex AI developments into actionable insights for
                founders, marketers, educators, and curious minds.
              </p>
              <p className="text-[14.5px] leading-[1.75] mb-4" style={{ color: 'var(--ts)' }}>
                Every week, we cover AI tools, business strategies, creative applications, and the ethical
                considerations shaping our AI-powered future — all in plain English.
              </p>

              <h2 className="text-[22px] font-extrabold mb-3.5 mt-7" style={{ color: 'var(--tp)' }}>What We Cover</h2>
              <div className="grid grid-cols-2 gap-3">
                {COVERAGE.map(({ Icon, title, desc }) => (
                  <div key={title} className="rounded-xl p-4"
                    style={{ background: 'var(--sur)', border: '1px solid var(--bdr)' }}>
                    <Icon size={20} style={{ color: 'var(--c2)', marginBottom: '6px' }} />
                    <div className="text-[13.5px] font-bold mb-1" style={{ color: 'var(--tp)' }}>{title}</div>
                    <div className="text-xs" style={{ color: 'var(--tm)' }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: stats + newsletter */}
            <div>
              <div className="rounded-[20px] p-7 mb-5 text-white"
                style={{ background: 'linear-gradient(135deg,var(--c1),var(--c2))' }}>
                <h3 className="text-lg font-extrabold mb-1.5">By the Numbers</h3>
                <p className="text-[13px] mb-5" style={{ color: 'rgba(255,255,255,.7)' }}>
                  Proud to serve a growing global community.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {STATS.map(s => (
                    <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,.12)' }}>
                      <div className="text-[26px] font-black">{s.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,.6)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter box */}
              <div className="relative rounded-[20px] overflow-hidden px-5.5 pt-7 pb-5.5"
                style={{ background: 'linear-gradient(135deg,#1a2560 0%,#293581 45%,#2a5ac8 75%,#4274d9 100%)' }}>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3"
                    style={{ background: 'rgba(149,204,213,.22)', border: '1px solid rgba(149,204,213,.35)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#95ccd5' }} />
                    <span className="text-[9.5px] font-extrabold uppercase tracking-[.07em]" style={{ color: '#ddeef0' }}>
                      Join 12,000+ Readers
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white mb-1.5">Stay Ahead of AI</h4>
                  <p className="text-xs leading-[1.55] mb-4" style={{ color: 'rgba(255,255,255,.65)' }}>
                    Every Friday: the most important AI developments, tools, and strategies — curated for people who mean business.
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <div><div className="text-lg font-black text-white">12K+</div><div className="text-[10px]" style={{ color: 'rgba(255,255,255,.55)' }}>Subscribers</div></div>
                    <div className="w-px h-7" style={{ background: 'rgba(255,255,255,.18)' }} />
                    <div><div className="text-lg font-black text-white">4.8</div><div className="text-[10px]" style={{ color: 'rgba(255,255,255,.55)' }}>Avg. Rating</div></div>
                    <div className="w-px h-7" style={{ background: 'rgba(255,255,255,.18)' }} />
                    <div><div className="text-lg font-black text-white">0</div><div className="text-[10px]" style={{ color: 'rgba(255,255,255,.55)' }}>Spam Emails</div></div>
                  </div>
                  <NewsletterForm buttonLabel="Subscribe Free — Every Friday" />
                  <p className="text-[10.5px] mt-3" style={{ color: 'rgba(255,255,255,.45)' }}>
                    No spam. Unsubscribe anytime. By subscribing you agree to our Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}

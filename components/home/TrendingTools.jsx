import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ToolIcon from '@/components/tools/ToolIcon';
import { TRENDING_TOOLS } from '@/config/tools';

export default function TrendingTools() {
  return (
    <section className="mb-2">
      <div className="flex items-center justify-between mb-1.5">
        <h2 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight" style={{ color: 'var(--tp)' }}>
          <span className="section-bar" aria-hidden="true" />
          Trending AI Tools This Week
        </h2>
        <Link href="/tools"
          className="flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-[rgba(66,116,217,.12)]"
          style={{ color: 'var(--c2)', border: '1px solid rgba(66,116,217,.2)', background: 'rgba(66,116,217,.05)' }}>
          All Tools <ArrowRight size={13} />
        </Link>
      </div>
      <p className="text-[13px] mb-4" style={{ color: 'var(--tm)' }}>
        Most-used AI tools by professionals. Includes referral links.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3.5">
        {TRENDING_TOOLS.map(tool => (
          <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer"
            className="relative flex flex-col items-center gap-2 text-center rounded-[13px] px-3 py-4.5 transition-all hover:-translate-y-1"
            style={{ background: 'var(--sur)', border: '1px solid var(--bdr)', boxShadow: 'var(--sh-sm)' }}>
            <span className="absolute top-2 left-2 w-[19px] h-[19px] rounded-full flex items-center justify-center text-[8.5px] font-extrabold text-white"
              style={{ background: 'var(--c1)' }}>
              {tool.rank}
            </span>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mt-2"
              style={{ background: tool.color }}>
              <ToolIcon name={tool.name} />
            </div>
            <div className="text-[12.5px] font-extrabold" style={{ color: 'var(--tp)' }}>{tool.name}</div>
            <div className="text-[10px]" style={{ color: 'var(--tm)' }}>{tool.cat}</div>
            <div className="flex items-center gap-1">
              <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(245,158,11,.1)', color: '#b45309' }}>
                ★ {tool.rating}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ color: 'var(--c2)', background: 'rgba(66,116,217,.08)', border: '1px solid rgba(66,116,217,.18)' }}>
                REF
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

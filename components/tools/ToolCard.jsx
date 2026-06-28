import ToolIcon from './ToolIcon';
import { BADGE_LABEL } from '@/config/tools';

export default function ToolCard({ tool }) {
  const badgeStyle = tool.badge === 'paid'
    ? { background: 'rgba(245,158,11,.1)', color: '#b45309', border: '1px solid rgba(245,158,11,.2)' }
    : { background: 'rgba(34,197,94,.1)', color: '#15803d', border: '1px solid rgba(34,197,94,.2)' };

  return (
    <a href={tool.url} target="_blank" rel="noopener noreferrer"
      className="relative flex flex-col items-center gap-2.5 text-center rounded-2xl px-3.5 py-5 transition-all hover:-translate-y-1"
      style={{ background: 'var(--sur)', border: '1px solid var(--bdr)', boxShadow: 'var(--sh-sm)' }}>
      <span className="absolute top-2 left-2 w-[19px] h-[19px] rounded-full flex items-center justify-center text-[8.5px] font-extrabold text-white"
        style={{ background: 'var(--c1)' }}>
        {tool.rank}
      </span>

      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: tool.color }}>
        <ToolIcon name={tool.name} />
      </div>

      <div className="text-[13px] font-extrabold" style={{ color: 'var(--tp)' }}>{tool.name}</div>
      <div className="text-[11px] leading-[1.4] line-clamp-2" style={{ color: 'var(--tm)' }}>{tool.desc}</div>

      <div className="flex items-center gap-1.5">
        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(245,158,11,.1)', color: '#b45309', border: '1px solid rgba(245,158,11,.2)' }}>
          ★ {tool.rating}
        </span>
        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full" style={badgeStyle}>
          {BADGE_LABEL[tool.badge]}
        </span>
      </div>

      <span className="text-[10.5px] font-extrabold px-3.5 py-1.5 rounded-full text-white transition-opacity hover:opacity-90"
        style={{ background: 'linear-gradient(135deg,var(--c1),var(--c2))' }}>
        {tool.badge === 'paid' ? 'Try Now →' : 'Try Free →'}
      </span>
    </a>
  );
}

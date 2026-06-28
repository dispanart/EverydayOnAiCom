'use client';

export default function ToolFilterBar({ categories, active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap py-5 mb-7" style={{ borderBottom: '1px solid var(--bdr)' }}>
      {categories.map(c => {
        const isOn = active === c.key;
        return (
          <button key={c.key} onClick={() => onChange(c.key)}
            className="text-[12.5px] font-bold px-4 py-2 rounded-full transition-all"
            style={isOn ? {
              background: 'linear-gradient(135deg,var(--c1),var(--c2))',
              color: '#fff',
              border: '1px solid transparent',
            } : {
              background: 'var(--sur)',
              color: 'var(--ts)',
              border: '1px solid var(--bdr)',
            }}>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

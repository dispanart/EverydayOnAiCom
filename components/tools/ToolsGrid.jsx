'use client';

import { useState, useMemo } from 'react';
import ToolFilterBar from './ToolFilterBar';
import ToolCard from './ToolCard';
import { TOOL_CATEGORIES, TOOL_GROUPS } from '@/config/tools';

export default function ToolsGrid() {
  const [active, setActive] = useState('all');

  const visibleGroups = useMemo(() => {
    if (active === 'all') return TOOL_GROUPS;
    return TOOL_GROUPS.filter(g => g.key === active);
  }, [active]);

  return (
    <>
      <ToolFilterBar categories={TOOL_CATEGORIES} active={active} onChange={setActive} />

      {visibleGroups.map(group => (
        <div key={group.key} className="mb-9">
          <h2 className="text-base font-extrabold mb-4 flex items-center gap-2" style={{ color: 'var(--tp)' }}>
            <span className="w-1 h-[21px] rounded-[4px] flex-shrink-0"
              style={{ background: 'linear-gradient(180deg,var(--c1),var(--c2))' }} />
            {group.label}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {group.tools.map(tool => <ToolCard key={tool.name} tool={tool} />)}
          </div>
        </div>
      ))}
    </>
  );
}

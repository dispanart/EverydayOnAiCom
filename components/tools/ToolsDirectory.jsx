'use client';

import { useMemo, useState } from 'react';
import { Play, Search, Star } from 'lucide-react';

function Icon({ item }) {
 if (item.icon === 'play') return <Play size={26} fill="white" color="white" />;
 if (item.icon === 'search') return <Search size={26} color="#20B2AA" />;
 return <span style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{item.icon}</span>;
}

function normalize(value) {
 return String(value || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ToolsDirectory({ groups = [] }) {
 const filters = useMemo(() => [
 { id: 'all', label: 'All Tools' },
 ...groups.map((group) => ({ id: normalize(group.title), label: group.title })),
 ], [groups]);

 const [active, setActive] = useState('all');
 const visibleGroups = active === 'all' ? groups : groups.filter((group) => normalize(group.title) === active);

 return (
 <>
 <div className="tcf" aria-label="Filter AI tools by category">
 {filters.map((filter) => (
 <button
 key={filter.id}
 type="button"
 className={`fb ${active === filter.id ? 'on' : ''}`}
 onClick={() => setActive(filter.id)}
 >
 {filter.label}
 </button>
 ))}
 </div>

 <div id="tgrid">
 {visibleGroups.map((group) => (
 <section key={group.title}>
 <h2 className="ts-ttl"><span className="sb" />{group.title}</h2>
 <div className="tgf">
 {group.tools.map((tool) => (
 <a key={tool.name} className="tcl" href={tool.href} target="_blank" rel="noopener noreferrer">
 <div className="tll" style={{ background: tool.bg }}><Icon item={tool} /></div>
 <div className="tnl">{tool.name}</div>
 <div className="tdl">{tool.desc}</div>
 <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
 <span className="fb2">{tool.cat}</span>
 <span className="tsc"><Star size={10} fill="currentColor" /> {tool.score}</span>
 </div>
 <span className="ttb">Visit tool</span>
 </a>
 ))}
 </div>
 </section>
 ))}
 </div>
 </>
 );
}

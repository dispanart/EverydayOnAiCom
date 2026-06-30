'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

function faviconSources(domain) {
 const cleanDomain = String(domain || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
 return [
  `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`,
  `https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleanDomain)}&sz=128`,
 ];
}

function ToolLogo({ tool }) {
 const sources = faviconSources(tool.domain);
 const [index, setIndex] = useState(0);
 const src = sources[index];

 if (!src) {
  return <span className="tool-logo-fallback" aria-hidden="true">{tool.name.slice(0, 2).toUpperCase()}</span>;
 }

 return (
  <img
   src={src}
   alt=""
   loading="lazy"
   width="56"
   height="56"
   referrerPolicy="no-referrer"
   onError={() => setIndex((current) => current + 1)}
  />
 );
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

 const visibleGroups = useMemo(() => (
  active === 'all' ? groups : groups.filter((group) => normalize(group.title) === active)
 ), [active, groups]);

 return (
 <>
 <div className="tools-filter-panel">
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
 </div>

 <div id="tgrid" className="tools-directory-grid">
 {visibleGroups.map((group) => (
 <section key={group.title} className="tools-group-section">
 <div className="tools-group-head">
 <h2 className="ts-ttl"><span className="sb" />{group.title}</h2>
 {group.summary && <p>{group.summary}</p>}
 </div>
 <div className="tgf tools-card-grid">
 {group.tools.map((tool) => (
 <a key={tool.name} className="tcl tool-card" href={tool.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${tool.name}`}>
 <div className="tool-logo-wrap">
 <ToolLogo tool={tool} />
 </div>
 <div className="tool-card-body">
 <div className="tnl">{tool.name}</div>
 <div className="tdl">{tool.desc}</div>
 </div>
 <div className="tool-card-footer">
 <span className="fb2">{tool.cat}</span>
 <span className="ttb">Visit <ArrowUpRight size={13} /></span>
 </div>
 </a>
 ))}
 </div>
 </section>
 ))}

 </div>
 </>
 );
}

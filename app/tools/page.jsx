import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE } from '@/config/site';
import { Play, Search, Star } from 'lucide-react';
import AdSense from '@/components/ui/AdSense';
import { AD_SLOTS } from '@/config/ads';

export const metadata = {
 title: `AI Tools — ${SITE.name}`,
 description: 'Curated AI tools for writing, research, coding, images, video, productivity, and business workflows.',
};

const groups = [
 {
 title: 'AI Assistants',
 tools: [
 { name: 'ChatGPT', desc: 'General AI assistant for writing, coding, planning, and research.', cat: 'Assistant', score: '9.5', href: 'https://chat.openai.com', bg: '#10a37f', icon: 'AI' },
 { name: 'Claude', desc: 'Long-context assistant for analysis, documents, and strategy.', cat: 'Assistant', score: '9.1', href: 'https://claude.ai', bg: '#d97706', icon: 'C' },
 { name: 'Gemini', desc: 'Google AI assistant for search-connected workflows.', cat: 'Assistant', score: '8.8', href: 'https://gemini.google.com', bg: '#4274d9', icon: 'G' },
 ],
 },
 {
 title: 'Creative AI',
 tools: [
 { name: 'Midjourney', desc: 'High-quality AI image generation for creative teams.', cat: 'Image', score: '9.2', href: 'https://www.midjourney.com', bg: '#000', icon: 'M' },
 { name: 'Runway', desc: 'AI video generation and editing for creators.', cat: 'Video', score: '8.6', href: 'https://www.runway.ml', bg: '#6d28d9', icon: 'play' },
 { name: 'Canva AI', desc: 'Design assistant for social, business, and brand assets.', cat: 'Design', score: '8.4', href: 'https://www.canva.com', bg: '#1e7a8c', icon: 'C' },
 ],
 },
 {
 title: 'AI Search & Research',
 tools: [
 { name: 'Perplexity', desc: 'Answer engine with citations for fast research.', cat: 'Search', score: '8.8', href: 'https://perplexity.ai', bg: '#1a1a2e', icon: 'search' },
 { name: 'NotebookLM', desc: 'Source-grounded research assistant for notes and PDFs.', cat: 'Research', score: '8.7', href: 'https://notebooklm.google.com', bg: '#293581', icon: 'N' },
 { name: 'Consensus', desc: 'AI search for scientific papers and evidence.', cat: 'Research', score: '8.2', href: 'https://consensus.app', bg: '#0f766e', icon: 'C' },
 ],
 },
];

function Icon({ item }) {
 if (item.icon === 'play') return <Play size={26} fill="white" color="white" />;
 if (item.icon === 'search') return <Search size={26} color="#20B2AA" />;
 return <span style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{item.icon}</span>;
}

export default function ToolsPage() {
 return (
 <>
 <Header />
 <main>
 <div className="tph"><div className="w"><h1>AI Tools Directory</h1><p>Curated AI tools for everyday productivity, business workflows, research, and creativity.</p></div></div>
 <div className="w">
 <AdSense slot={AD_SLOTS.toolsTop} className="eonai-ad-list-top" />
 <div className="tcf" id="tcf">
 <span className="fb on">All Tools</span>
 <span className="fb">Assistants</span>
 <span className="fb">Creative AI</span>
 <span className="fb">Research</span>
 </div>
 <div id="tgrid">
 {groups.map((group) => (
 <section key={group.title}>
 <h2 className="ts-ttl"><span className="sb" />{group.title}</h2>
 <div className="tgf">
 {group.tools.map((tool) => (
 <a key={tool.name} className="tcl" href={tool.href} target="_blank" rel="noopener noreferrer">
 <div className="tll" style={{ background: tool.bg }}><Icon item={tool} /></div>
 <div className="tnl">{tool.name}</div>
 <div className="tdl">{tool.desc}</div>
 <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span className="fb2">{tool.cat}</span><span className="tsc"><Star size={10} fill="currentColor" /> {tool.score}</span></div>
 <span className="ttb">Visit tool</span>
 </a>
 ))}
 </div>
 </section>
 ))}
 </div>
 </div>
 </main>
 <Footer />
 </>
 );
}

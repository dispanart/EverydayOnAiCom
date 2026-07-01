import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE } from '@/config/site';
import AdSense from '@/components/ui/AdSense';
import { AD_SLOTS } from '@/config/ads';
import ToolsDirectory from '@/components/tools/ToolsDirectory';

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

export default function ToolsPage() {
 return (
 <>
 <Header />
 <main>
 <div className="tph"><div className="w"><h1>AI Tools Directory</h1><p>Curated AI tools for everyday productivity, business workflows, research, and creativity.</p></div></div>
 <div className="w">
 <AdSense slot={AD_SLOTS.toolsTop} className="eonai-ad-list-top" />
 <ToolsDirectory groups={groups} />
 </div>
 </main>
 <Footer />
 </>
 );
}

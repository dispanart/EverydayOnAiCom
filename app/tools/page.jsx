import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE } from '@/config/site';
import AdSense from '@/components/ui/AdSense';
import { AD_SLOTS } from '@/config/ads';
import ToolsDirectory from '@/components/tools/ToolsDirectory';

export const metadata = {
 title: `AI Tools — ${SITE.name}`,
 description: 'A curated English directory of AI assistants, creative AI tools, AI research platforms, and vibe-coding tools with official links.',
 alternates: { canonical: `${SITE.url}/tools` },
 openGraph: {
  title: `AI Tools — ${SITE.name}`,
  description: 'Curated AI tools for productivity, creative work, research, and app building.',
  url: `${SITE.url}/tools`,
  type: 'website',
 },
};

const groups = [
 {
 title: 'AI Assistant',
 summary: 'Daily productivity and text-focused AI tools for summarizing, writing emails, answering questions, and automating office work.',
 tools: [
  { name: 'ChatGPT', desc: 'A general-purpose AI assistant for writing, planning, coding, brainstorming, and everyday productivity.', cat: 'Productivity', href: 'https://chatgpt.com/', domain: 'chatgpt.com' },
  { name: 'Claude', desc: 'A long-context AI assistant for analysis, strategy, drafting, and document-heavy workflows.', cat: 'Writing', href: 'https://claude.ai/', domain: 'claude.ai' },
  { name: 'Gemini', desc: 'Google’s AI assistant for multimodal work, search-connected tasks, writing, and productivity.', cat: 'Google AI', href: 'https://gemini.google.com/', domain: 'gemini.google.com' },
  { name: 'Microsoft Copilot', desc: 'An AI assistant for Microsoft 365, web answers, productivity, documents, and office workflows.', cat: 'Office', href: 'https://copilot.microsoft.com/', domain: 'copilot.microsoft.com' },
 ],
 },
 {
 title: 'Creative AI',
 summary: 'Visual and audio content creation tools for images, cinematic video, studio music, voice generation, and design work.',
 tools: [
  { name: 'Midjourney', desc: 'High-quality image generation for art direction, concepts, editorial visuals, and brand moodboards.', cat: 'Image', href: 'https://www.midjourney.com/', domain: 'midjourney.com' },
  { name: 'Runway', desc: 'AI video generation and editing for cinematic clips, motion design, and creative production.', cat: 'Video', href: 'https://runwayml.com/', domain: 'runwayml.com' },
  { name: 'Suno AI', desc: 'AI music generation for songs, demos, creative ideas, and audio experimentation.', cat: 'Music', href: 'https://suno.com/', domain: 'suno.com' },
  { name: 'ElevenLabs', desc: 'AI voice generation, dubbing, voice cloning, narration, and studio-quality speech workflows.', cat: 'Voice', href: 'https://elevenlabs.io/', domain: 'elevenlabs.io' },
  { name: 'Canva AI', desc: 'AI-assisted design tools for presentations, social posts, marketing assets, and visual content.', cat: 'Design', href: 'https://www.canva.com/ai/', domain: 'canva.com' },
 ],
 },
 {
 title: 'AI Search & Research',
 summary: 'Research-focused AI tools for analyzing documents, reviewing academic papers, summarizing PDFs, and finding credible sources.',
 tools: [
  { name: 'NotebookLM', desc: 'A source-grounded research assistant for PDFs, notes, websites, audio overviews, and study materials.', cat: 'Documents', href: 'https://notebooklm.google.com/', domain: 'notebooklm.google.com' },
  { name: 'Consensus', desc: 'AI-powered search for scientific papers, evidence summaries, and research-backed answers.', cat: 'Academic', href: 'https://consensus.app/', domain: 'consensus.app' },
  { name: 'Elicit', desc: 'An AI research assistant for literature reviews, paper discovery, extraction, and academic workflows.', cat: 'Literature', href: 'https://elicit.com/', domain: 'elicit.com' },
  { name: 'SciSpace', desc: 'AI tools for understanding research papers, explaining concepts, and analyzing academic documents.', cat: 'Papers', href: 'https://typeset.io/', domain: 'typeset.io' },
  { name: 'Perplexity', desc: 'An AI answer engine for cited web research, source discovery, and fast topic exploration.', cat: 'Search', href: 'https://www.perplexity.ai/', domain: 'perplexity.ai' },
 ],
 },
 {
 title: 'AI Vibe Coding',
 summary: 'Conversational app-building tools for creating software, editing many files, and deploying projects from natural-language instructions.',
 tools: [
  { name: 'Cursor', desc: 'An AI code editor for building, refactoring, and navigating large codebases with natural-language assistance.', cat: 'Code Editor', href: 'https://cursor.com/', domain: 'cursor.com' },
  { name: 'Bolt.new', desc: 'A browser-based AI app builder for prototyping full-stack applications from conversational prompts.', cat: 'App Builder', href: 'https://bolt.new/', domain: 'bolt.new' },
  { name: 'v0 by Vercel', desc: 'An AI interface builder for generating React and Next.js UI from text prompts.', cat: 'UI Builder', href: 'https://v0.dev/', domain: 'v0.dev' },
  { name: 'Replit Agent', desc: 'An AI agent for building, editing, and deploying apps inside Replit’s cloud development environment.', cat: 'Cloud IDE', href: 'https://replit.com/ai', domain: 'replit.com' },
  { name: 'Lovable', desc: 'A conversational AI app builder for turning product ideas into working web applications.', cat: 'No-Code', href: 'https://lovable.dev/', domain: 'lovable.dev' },
  { name: 'Base44', desc: 'An AI app builder for creating database-backed tools and business apps from plain-English instructions.', cat: 'Business Apps', href: 'https://base44.com/', domain: 'base44.com' },
 ],
 },
];

export default function ToolsPage() {
 return (
 <>
 <Header />
 <main>
 <div className="tph"><div className="w"><h1>AI Tools Directory</h1><p>Explore practical AI tools by use case: assistants, creative generation, research, and vibe coding.</p></div></div>
 <div className="w">
 <AdSense slot={AD_SLOTS.toolsTop} className="eonai-ad-list-top" />
 <ToolsDirectory groups={groups} />
 </div>
 </main>
 <Footer />
 </>
 );
}

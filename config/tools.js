/**
 * ─────────────────────────────────────────────────────────────────
 *  AI TOOLS DIRECTORY — Single source of truth
 *  Real tools, real links. Update ratings/badges as needed.
 * ─────────────────────────────────────────────────────────────────
 */

export const TOOL_CATEGORIES = [
  { key: 'all', label: 'All Tools' },
  { key: 'assistant', label: 'AI Assistants' },
  { key: 'image', label: 'Image Generation' },
  { key: 'video', label: 'Video AI' },
  { key: 'writing', label: 'Writing & Content' },
  { key: 'search', label: 'AI Search' },
  { key: 'productivity', label: 'Productivity' },
  { key: 'voice', label: 'Voice & Audio' },
  { key: 'code', label: 'Coding' },
];

export const TOOL_GROUPS = [
  {
    key: 'assistant',
    label: 'AI Assistants',
    tools: [
      { rank: 1, name: 'ChatGPT', desc: "The world's most popular AI assistant by OpenAI. GPT-4o included.", url: 'https://chat.openai.com', rating: 9.5, badge: 'free', color: '#10a37f' },
      { rank: 2, name: 'Claude', desc: "Anthropic's thoughtful AI. Best for writing, analysis, and coding.", url: 'https://claude.ai', rating: 9.1, badge: 'free', color: '#d97706' },
      { rank: 3, name: 'Gemini', desc: "Google's multimodal AI. Excellent for research and Workspace.", url: 'https://gemini.google.com', rating: 8.9, badge: 'free', color: 'linear-gradient(135deg,#4285f4,#ea4335,#fbbc04,#34a853)' },
      { rank: 4, name: 'MS Copilot', desc: "Microsoft's AI powered by GPT-4. Deeply integrated with Office 365.", url: 'https://copilot.microsoft.com', rating: 8.7, badge: 'free', color: '#0078d4' },
      { rank: 5, name: 'Poe', desc: 'Access Claude, GPT-4, Llama, and more in one app.', url: 'https://poe.com', rating: 8.4, badge: 'free', color: '#7c3aed' },
    ],
  },
  {
    key: 'image',
    label: 'Image Generation',
    tools: [
      { rank: 1, name: 'Midjourney', desc: 'The gold standard for AI art. Unmatched aesthetic quality.', url: 'https://www.midjourney.com', rating: 9.2, badge: 'paid', color: '#000' },
      { rank: 2, name: 'DALL·E 4', desc: "OpenAI's latest image generator. Best for realistic scenes.", url: 'https://openai.com/dall-e-3', rating: 9.0, badge: 'freeplus', color: '#10a37f' },
      { rank: 3, name: 'Stable Diffusion', desc: 'Open-source image AI. Full control for power users.', url: 'https://stability.ai', rating: 8.6, badge: 'free', color: '#1a1a2e' },
      { rank: 4, name: 'Ideogram', desc: 'Exceptional at text in images. Best for logos and posters.', url: 'https://ideogram.ai', rating: 8.3, badge: 'free', color: '#0f172a' },
      { rank: 5, name: 'Adobe Firefly', desc: 'Commercially-safe AI images. Perfect for professionals.', url: 'https://www.adobe.com/products/firefly.html', rating: 8.5, badge: 'freeplus', color: '#ff0000' },
    ],
  },
  {
    key: 'video',
    label: 'Video AI',
    tools: [
      { rank: 1, name: 'Runway Gen-3', desc: 'Industry-leading AI video generation. Used by major studios.', url: 'https://www.runway.ml', rating: 9.1, badge: 'paid', color: '#6d28d9' },
      { rank: 2, name: 'Sora', desc: "OpenAI's text-to-video model. Cinematic quality in seconds.", url: 'https://openai.com/sora', rating: 9.0, badge: 'paid', color: '#10a37f' },
      { rank: 3, name: 'HeyGen', desc: 'AI avatar video for corporate and marketing content.', url: 'https://www.heygen.com', rating: 8.8, badge: 'paid', color: '#3b82f6' },
      { rank: 4, name: 'Pika', desc: 'Fast and accessible AI video for social media.', url: 'https://pika.art', rating: 8.5, badge: 'freeplus', color: '#7c3aed' },
      { rank: 5, name: 'InVideo AI', desc: 'Turn scripts into professional videos fast.', url: 'https://invideo.io', rating: 8.2, badge: 'freeplus', color: '#0ea5e9' },
    ],
  },
  {
    key: 'writing',
    label: 'Writing & Content',
    tools: [
      { rank: 1, name: 'Jasper', desc: 'Enterprise AI writing platform for marketing teams.', url: 'https://www.jasper.ai', rating: 8.7, badge: 'paid', color: '#7c3aed' },
      { rank: 2, name: 'Copy.ai', desc: 'AI copywriting for ads, emails, and landing pages.', url: 'https://www.copy.ai', rating: 8.4, badge: 'freeplus', color: '#6366f1' },
      { rank: 3, name: 'Grammarly', desc: 'AI writing assistant for grammar, tone, and clarity.', url: 'https://www.grammarly.com', rating: 8.9, badge: 'freeplus', color: '#15c39a' },
      { rank: 4, name: 'Notion AI', desc: 'AI writing built directly into your Notion workspace.', url: 'https://www.notion.so/product/ai', rating: 8.5, badge: 'paid', color: '#000' },
      { rank: 5, name: 'Sudowrite', desc: 'AI built specifically for fiction writers and novelists.', url: 'https://www.sudowrite.com', rating: 8.3, badge: 'paid', color: '#ec4899' },
    ],
  },
  {
    key: 'search',
    label: 'AI Search',
    tools: [
      { rank: 1, name: 'Perplexity', desc: 'AI-powered search with cited sources. Research superpower.', url: 'https://perplexity.ai', rating: 9.0, badge: 'free', color: '#1a1a2e' },
      { rank: 2, name: 'You.com', desc: 'Personalized AI search engine with apps and agents.', url: 'https://you.com', rating: 8.5, badge: 'free', color: '#4274d9' },
      { rank: 3, name: 'Bing AI', desc: "Microsoft's AI search powered by GPT-4. Web-connected.", url: 'https://www.bing.com/chat', rating: 8.3, badge: 'free', color: '#0078d4' },
      { rank: 4, name: 'Kagi', desc: 'Premium AI search with no ads and superior quality.', url: 'https://kagi.com', rating: 8.1, badge: 'paid', color: '#293581' },
      { rank: 5, name: 'Phind', desc: 'AI search built for developers. Code-focused search engine.', url: 'https://www.phind.com', rating: 8.0, badge: 'free', color: '#1e293b' },
    ],
  },
  {
    key: 'productivity',
    label: 'Productivity',
    tools: [
      { rank: 1, name: 'Notion AI', desc: 'AI-enhanced workspace for notes, docs, and projects.', url: 'https://www.notion.so/product/ai', rating: 8.8, badge: 'paid', color: '#000' },
      { rank: 2, name: 'Motion', desc: 'AI calendar that auto-schedules your tasks and meetings.', url: 'https://www.usemotion.com', rating: 8.4, badge: 'paid', color: '#ef4444' },
      { rank: 3, name: 'Reclaim AI', desc: 'Smart scheduling that protects your focus time automatically.', url: 'https://reclaim.ai', rating: 8.2, badge: 'freeplus', color: '#6366f1' },
      { rank: 4, name: 'Otter.ai', desc: 'AI meeting notes, transcription, and action items.', url: 'https://otter.ai', rating: 8.6, badge: 'freeplus', color: '#1e90ff' },
      { rank: 5, name: 'Mem', desc: 'Self-organizing AI notes app for knowledge workers.', url: 'https://mem.ai', rating: 8.0, badge: 'paid', color: '#f59e0b' },
    ],
  },
  {
    key: 'voice',
    label: 'Voice & Audio',
    tools: [
      { rank: 1, name: 'ElevenLabs', desc: 'Industry-leading AI voice generation and cloning.', url: 'https://elevenlabs.io', rating: 9.0, badge: 'freeplus', color: '#000' },
      { rank: 2, name: 'Suno', desc: 'Generate full songs with vocals from a text prompt.', url: 'https://suno.com', rating: 8.7, badge: 'freeplus', color: '#7c3aed' },
      { rank: 3, name: 'Descript', desc: 'Edit audio and video by editing text. AI-powered podcasting.', url: 'https://www.descript.com', rating: 8.6, badge: 'freeplus', color: '#ef4444' },
      { rank: 4, name: 'Murf AI', desc: 'Studio-quality AI voiceovers for videos and presentations.', url: 'https://murf.ai', rating: 8.3, badge: 'paid', color: '#0ea5e9' },
      { rank: 5, name: 'Udio', desc: 'AI music generation with strong genre and style control.', url: 'https://www.udio.com', rating: 8.1, badge: 'freeplus', color: '#22c55e' },
    ],
  },
  {
    key: 'code',
    label: 'Coding AI',
    tools: [
      { rank: 1, name: 'GitHub Copilot', desc: 'AI pair programmer. Autocompletes code in real-time.', url: 'https://github.com/features/copilot', rating: 9.3, badge: 'paid', color: '#24292e' },
      { rank: 2, name: 'Claude Code', desc: 'Agentic coding in your terminal. Writes and fixes entire projects.', url: 'https://claude.ai', rating: 9.0, badge: 'freeplus', color: '#d97706' },
      { rank: 3, name: 'Cursor', desc: 'AI-first code editor. The IDE that thinks with you.', url: 'https://cursor.sh', rating: 8.8, badge: 'freeplus', color: '#1a1a2e' },
      { rank: 4, name: 'v0 by Vercel', desc: 'Generate React UIs from text prompts. Ship UIs instantly.', url: 'https://v0.dev', rating: 8.6, badge: 'freeplus', color: '#000' },
      { rank: 5, name: 'Replit AI', desc: 'Code, build, and deploy in the browser with AI assistance.', url: 'https://replit.com', rating: 8.4, badge: 'freeplus', color: '#f26207' },
    ],
  },
];

/** Top 5 trending tools shown on the homepage strip */
export const TRENDING_TOOLS = [
  { rank: 1, name: 'ChatGPT', cat: 'AI Assistant', url: 'https://chat.openai.com', rating: 9.5, color: '#10a37f' },
  { rank: 2, name: 'Midjourney', cat: 'AI Image', url: 'https://www.midjourney.com', rating: 9.2, color: '#000' },
  { rank: 3, name: 'Claude', cat: 'AI Assistant', url: 'https://claude.ai', rating: 9.1, color: '#d97706' },
  { rank: 4, name: 'Perplexity', cat: 'AI Search', url: 'https://perplexity.ai', rating: 8.8, color: '#1a1a2e' },
  { rank: 5, name: 'Runway', cat: 'AI Video', url: 'https://www.runway.ml', rating: 8.6, color: '#6d28d9' },
];

export const BADGE_LABEL = { free: 'Free', paid: 'Paid', freeplus: 'Free+' };

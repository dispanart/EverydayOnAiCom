import Image from 'next/image';
import Link from 'next/link';
import { SITE } from '@/config/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ChevronRight } from 'lucide-react';

export const revalidate = 3600;

export const metadata = {
  title: 'Dispa — The AI Buff | AI Strategist & Founder, EverydayOnAI',
  description:
    'Dispa is the founder of EverydayOnAI.com covering AI SEO (GEO, AEO, LLMO), AI governance, EU AI Act compliance, and enterprise AI strategy. Independent researcher since 2023.',
  openGraph: {
    title: 'Dispa — AI Strategist, Researcher & Founder of EverydayOnAI',
    description:
      'Independent AI researcher covering GEO, AEO, LLMO, AI governance, EU AI Act, and enterprise AI strategy. Founder of EverydayOnAI.com since 2023.',
    type: 'profile',
    url: 'https://everydayonai.com/about/dispa',
  },
  alternates: { canonical: 'https://everydayonai.com/about/dispa' },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://everydayonai.com/about/dispa/#person',
      name: 'Dispa',
      alternateName: 'The AI Buff',
      url: 'https://everydayonai.com/about/dispa',
      image: {
        '@type': 'ImageObject',
        url: 'https://everydayonai.com/authors/dispa-ai-buff-author-photo.webp',
        width: 400, height: 400,
      },
      jobTitle: 'AI Strategist, Independent Researcher & Founder',
      description:
        'Independent AI researcher and founder of EverydayOnAI.com. Covers AI search optimization (GEO, AEO, LLMO), AI governance frameworks, EU AI Act compliance, enterprise AI strategy, and practical AI tools for business. Writing and researching AI since 2023.',
      knowsAbout: [
        'Generative Engine Optimization (GEO)', 'Answer Engine Optimization (AEO)',
        'Large Language Model Optimization (LLMO)', 'AI SEO', 'AI Governance',
        'EU AI Act Compliance', 'NIST AI Risk Management Framework',
        'ISO 42001 AI Management System', 'Enterprise AI Strategy',
        'AI Risk Assessment', 'Shadow AI Compliance', 'Featured Snippet Optimization',
        'Schema Markup', 'Google AI Overviews', 'ChatGPT Content Strategy',
        'Perplexity AI Optimization', 'AI Ethics and Responsible AI',
        'Colorado AI Act', 'Singapore IMDA AI Framework',
      ],
      worksFor: {
        '@type': 'Organization',
        '@id': 'https://everydayonai.com/#organization',
        name: 'EverydayOnAI', url: 'https://everydayonai.com',
      },
      mainEntityOfPage: {
        '@type': 'ProfilePage',
        '@id': 'https://everydayonai.com/about/dispa',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://everydayonai.com/#organization',
      name: 'EverydayOnAI',
      url: 'https://everydayonai.com',
      logo: { '@type': 'ImageObject', url: 'https://everydayonai.com/icon-512.webp' },
      founder: { '@type': 'Person', '@id': 'https://everydayonai.com/about/dispa/#person' },
      foundingDate: '2023',
      description:
        'EverydayOnAI is an independent AI research and strategy publication covering AI search optimization (GEO, AEO, LLMO), AI governance frameworks, EU AI Act compliance, and practical AI strategy for business.',
      areaServed: 'Worldwide',
      inLanguage: ['en'],
    },
  ],
};

// ── Data ──────────────────────────────────────────────────────────────────────

const BADGES_SEO  = ['GEO', 'AEO', 'LLMO', 'AI SEO'];
const BADGES_GOV  = ['AI Governance', 'EU AI Act', 'NIST AI RMF', 'Enterprise AI'];
const BADGES_GEN  = ['Content Strategy', 'Schema Markup'];

const STATS = [
  { num: '3+',  label: 'Years researching AI strategy & policy' },
  { num: '19+', label: 'Articles published on EverydayOnAI (2025–2026)' },
  { num: '2',   label: 'Major clusters: AI SEO Hub & AI Governance Hub' },
  { num: '60+', label: 'Primary sources cited across both clusters' },
  { num: '8',   label: 'AI platforms tracked (ChatGPT, Perplexity, Gemini, Claude…)' },

];

const EXPERTISE = [
  { icon: '🔍', title: 'GEO — Generative Engine Optimization', gov: false,
    desc: 'Structuring content for citation inside AI-generated answers — ChatGPT, Perplexity, Google AI Overviews. Research grounded in the Princeton/KDD 2024 academic study and ongoing industry benchmarks (ConvertMate, Ahrefs, Semrush).' },
  { icon: '🔍', title: 'AEO — Answer Engine Optimization', gov: false,
    desc: 'Winning featured snippets (paragraph 40-60w, list 5-8 items, table 3-4 columns), People Also Ask, voice search, and AI answer boxes. Includes query fan-out mapping, PAA chain research, and snippet-format matching.' },
  { icon: '🔍', title: 'LLMO — LLM Optimization', gov: false,
    desc: 'Building brand entity clarity for AI model representation — Person and Organization schema, consistent entity signals, and third-party brand mention strategy for long-term LLM brand recall.' },
  { icon: '🔍', title: 'Schema Markup & Structured Data', gov: false,
    desc: 'Practical implementation of Article, FAQPage, Speakable, Person, Organization, HowTo schema — with current data on what each schema type actually produces for AI citation versus traditional rich results.' },
  { icon: '⚖️', title: 'EU AI Act', gov: true,
    desc: 'Risk classification (unacceptable, high, limited, minimal), compliance timelines, documentation requirements, conformity assessment obligations, and practical guidance for organizations building or deploying AI systems in the EU.' },
  { icon: '⚖️', title: 'AI Governance Frameworks', gov: true,
    desc: 'NIST AI RMF, ISO/IEC 42001:2023, EU AI Act, Singapore IMDA framework, Colorado AI Act, and how these frameworks compare across seven dimensions for enterprise compliance planning.' },
  { icon: '⚖️', title: 'Enterprise AI Risk', gov: true,
    desc: 'Shadow AI compliance risk, AI impact assessments, bias auditing, documentation requirements, and the organizational governance structures that regulatory frameworks increasingly require.' },
  { icon: '⚖️', title: 'AI Policy & Emerging Regulation', gov: true,
    desc: 'Comparative analysis of global AI regulation — EU vs US AI policy divergence, the Colorado AI Act as a US state-level precedent, and how different regulatory approaches affect organizations globally.' },
];

const ARTICLES_GOV = [
  { tag: 'Pillar — AI Governance', title: 'AI Governance in 2026: Complete Guide', meta: 'Pillar article · Published June 15, 2026', href: '/ai-governance-guide' },
  { tag: 'Spoke — AI Governance', title: 'What Is AI Governance? Definition, Importance & Core Principles', meta: 'Published June 16, 2026', href: '/what-is-ai-governance' },
  { tag: 'Spoke — AI Governance', title: 'The 5 Core Pillars of AI Governance', meta: 'Published June 16, 2026', href: '/pillars-of-ai-governance' },
  { tag: 'Spoke — AI Governance', title: '7 AI Governance Frameworks Compared: NIST, ISO 42001, EU AI Act & More', meta: 'Published June 17, 2026', href: '/ai-governance-frameworks-2026' },
  { tag: 'Spoke — EU AI Act', title: 'EU AI Act Explained: Risk Categories & Prohibited AI Systems', meta: 'Published June 7, 2026', href: '/eu-ai-act-explained-risk-categories-prohibited-ai-2026' },
  { tag: 'Spoke — EU AI Act', title: 'EU AI Act Compliance Guide: What Businesses Need to Do Now', meta: 'Published June 7, 2026', href: '/eu-ai-act-compliance-guide' },
  { tag: 'Spoke — EU AI Act', title: 'How to Classify Your AI System Under the EU AI Act', meta: 'Published June 7, 2026', href: '/how-to-classify-ai-system-eu-ai-act' },
  { tag: 'Spoke — EU AI Act', title: 'EU AI Act Documentation Requirements: Complete Checklist', meta: 'Published June 7, 2026', href: '/eu-ai-act-documentation-requirements' },
  { tag: 'Spoke — AI Policy', title: 'EU AI Act vs US AI Policy: Key Differences Explained', meta: 'Published June 8, 2026', href: '/eu-ai-act-vs-us-ai-policy' },
  { tag: 'Spoke — Enterprise AI Risk', title: 'Shadow AI: The Silent Compliance Risk Your IT Team Doesn\'t See', meta: 'Published June 10, 2026', href: '/shadow-ai-compliance-risk' },
  { tag: 'Spoke — AI Policy', title: 'Colorado AI Act Compliance Guide: What It Means for US Businesses', meta: 'Published June 10, 2026', href: '/colorado-ai-act' },
];

const ARTICLES_SEO = [
  { tag: 'Pillar — AI SEO', title: 'What is AI SEO? The Complete Guide to GEO, AEO & LLMO (2026)', meta: '7,600+ words · AI Citation Readiness Score tool · June 2026', href: '/ai-seo-guide' },
  { tag: 'Sub-pillar — GEO', title: 'GEO Complete Guide: How to Get Cited by ChatGPT, Perplexity & Google AI', meta: 'Princeton/KDD 2024 research · Updated June 2026', href: '/generative-engine-optimization' },
  { tag: 'Sub-pillar — AEO', title: 'What is AEO? The Complete Answer Engine Optimization Guide (2026)', meta: '6,600+ words · Snippet-Readiness Checker tool · June 2026', href: '/answer-engine-optimization' },
  { tag: 'Spoke — Comparison', title: 'GEO vs AEO: Key Differences Explained (2026 Decision Framework)', meta: '3,700+ words · Playbook Router tool · June 2026', href: '/geo-vs-aeo' },
  { tag: 'Spoke — AEO', title: 'AEO vs SEO: What Changes and What Stays (2026)', meta: '4,100+ words · Ahrefs schema markup finding · June 2026', href: '/aeo-vs-seo' },
  { tag: 'Spoke — AEO', title: 'AEO Keyword Research: Finding Answer-Intent Queries (2026 Guide)', meta: '4,700+ words · 5-tool stack & 0-12 scoring system · June 2026', href: '/aeo-keyword-research' },
  { tag: 'Spoke — AEO', title: 'How to Write for Featured Snippets & Voice Search (2026 Guide)', meta: '4,500+ words · 3 format specs & rewrites · June 2026', href: '/optimize-for-featured-snippets' },
];

const EDITORIAL_STANDARDS = [
  { title: 'Named primary sources only.', body: 'Every statistic is cited inline — [Organization] [finding] ([Source, Year]). No "studies show" without a named source. Aggregator blog statistics are traced to their original research before use.' },
  { title: 'No hallucination policy.', body: 'Where the original primary source cannot be identified and independently verified, the statistic is not published. This applies to both the AI SEO Hub and the AI Governance Hub — including EU AI Act regulatory texts, which are cited from the Official Journal of the European Union directly.' },
  { title: 'Opinion clearly labeled.', body: 'Editorial opinion appears in clearly marked "According to EverydayOnAI" boxes in every article — visually and structurally separated from cited research. Opinion is never presented as data.' },
  { title: 'Quarterly freshness cycle.', body: 'All articles are reviewed quarterly. Statistics older than 12 months are updated or flagged. The visible "Last Reviewed" date in each article reflects when content was actively verified — not just when it was last touched.' },
  { title: 'Corrections policy.', body: 'When a cited figure is found to be incorrect, the article is updated with a visible revision note. EverydayOnAI does not silently edit factual errors.' },
  { title: 'Self-compliance.', body: 'EverydayOnAI practices the strategies it covers. Articles on AI SEO use FAQPage, Speakable, and Article schema. This author page uses full Person entity schema.' },
  { title: 'Regulatory coverage verified against primary texts.', body: 'EU AI Act content is verified against Regulation (EU) 2024/1689. NIST AI RMF content is verified against the published NIST AI 100-1 document. No AI Governance claims are based solely on third-party summaries.' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function DispaAuthorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="min-h-screen bg-white">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-8 flex-wrap">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <ChevronRight size={13} />
              <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
              <ChevronRight size={13} />
              <span className="text-slate-700 font-semibold">Dispa</span>
            </nav>

            <div className="flex flex-col sm:flex-row items-start gap-8">

              {/* Photo */}
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-slate-200/60 flex-shrink-0 mx-auto sm:mx-0">
                <Image
                  src="/authors/dispa-ai-buff-author-photo.webp"
                  alt="Dispa, AI strategist and founder of EverydayOnAI.com"
                  fill
                  className="object-cover"
                  priority
                  sizes="144px"
                />
              </div>

              {/* Text */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-3 mb-1 justify-center sm:justify-start flex-wrap">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dispa</h1>
                  <span className="text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-0.5 rounded-full">
                    The AI Buff
                  </span>
                </div>
                <p className="text-blue-600 font-semibold text-sm mb-1">
                  AI Strategist, Independent Researcher & Founder of EverydayOnAI.com
                </p>
                <p className="text-slate-400 text-sm mb-5">
                  Writing about AI since 2023
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-5 justify-center sm:justify-start">
                  {BADGES_SEO.map(b => (
                    <span key={b} className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">{b}</span>
                  ))}
                  {BADGES_GOV.map(b => (
                    <span key={b} className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">{b}</span>
                  ))}
                  {BADGES_GEN.map(b => (
                    <span key={b} className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">{b}</span>
                  ))}
                </div>

                {/* Socials — update href when ready */}
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <a href="https://www.linkedin.com/in/[REPLACE-WITH-LINKEDIN]" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                    🔗 LinkedIn
                  </a>
                  <a href="https://twitter.com/[REPLACE-WITH-TWITTER]" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                    🔗 Twitter / X
                  </a>
                  <a href="https://everydayonai.com"
                    className="flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                    🌐 EverydayOnAI.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {STATS.map(({ num, label }) => (
              <div key={label} className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
                <div className="text-3xl font-extrabold text-blue-700 mb-1">{num}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{label}</div>
              </div>
            ))}
          </div>

          {/* About */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-5">About Dispa</h2>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
              <p>Dispa is an independent AI researcher and the founder of <a href="https://everydayonai.com" className="text-blue-600 font-semibold hover:underline">EverydayOnAI.com</a>, a publication covering two intersecting areas of the AI landscape: <strong>AI search optimization</strong> (GEO, AEO, LLMO, and AI SEO) and <strong>AI governance</strong> (EU AI Act, NIST AI RMF, ISO 42001, enterprise compliance, and emerging AI policy globally).</p>
              <p>Writing under the name "The AI Buff" since 2023, Dispa's approach is grounded in primary source research — academic papers, regulatory texts, and named industry benchmarks — rather than repurposed aggregator content. Every article on EverydayOnAI cites sources inline with organization name and year, and distinguishes clearly between documented data and editorial analysis.</p>
              <p>Before founding EverydayOnAI, Dispa built software products across web and mobile — experience that directly informs coverage of how AI tools are built, deployed, and regulated — not just how they are marketed.</p>
            </div>
          </div>

          {/* Expertise */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Areas of Expertise</h2>
            <p className="text-slate-500 text-sm mb-6">EverydayOnAI covers two distinct but related clusters. The AI SEO Hub addresses how to build visibility on AI-powered search platforms. The AI Governance Hub addresses how organizations should manage, risk-assess, and comply with regulation around AI systems they build or use.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EXPERTISE.map(({ icon, title, gov, desc }) => (
                <div key={title} className={`rounded-xl border p-5 ${gov ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${gov ? 'text-orange-700' : 'text-blue-700'}`}>
                    {icon} {title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Published Articles on EverydayOnAI</h2>

            {/* AI Governance */}
            <p className="text-xs font-bold uppercase tracking-wider text-orange-700 border-b-2 border-orange-200 pb-2 mb-4">
              ⚖️ AI Governance Hub — Live Articles
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {ARTICLES_GOV.map(({ tag, title, meta, href }) => (
                <Link key={href} href={href}
                  className="block bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-orange-50 hover:border-orange-200 transition-all">
                  <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">{tag}</p>
                  <p className="text-sm font-bold text-slate-900 leading-snug mb-1">{title}</p>
                  <p className="text-xs text-slate-400">{meta}</p>
                </Link>
              ))}
            </div>

            {/* AI SEO */}
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b-2 border-blue-200 pb-2 mb-4">
              🔍 AI SEO Hub — Live & In Production
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ARTICLES_SEO.map(({ tag, title, meta, href }) => (
                <Link key={href} href={href}
                  className="block bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-200 transition-all">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">{tag}</p>
                  <p className="text-sm font-bold text-slate-900 leading-snug mb-1">{title}</p>
                  <p className="text-xs text-slate-400">{meta}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Editorial Standards */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Editorial Standards & E-E-A-T Commitment</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800 leading-relaxed">
              <strong>Note for readers and advertisers:</strong> EverydayOnAI is an independently operated publication. All content reflects Dispa's independent research and analysis. No article is sponsored, ghostwritten, or produced at the direction of any vendor or advertiser. Editorial opinion is clearly separated from cited research in all articles.
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-green-800 mb-4">✓ How EverydayOnAI Maintains Content Quality</h3>
              <ul className="space-y-3">
                {EDITORIAL_STANDARDS.map(({ title, body }) => (
                  <li key={title} className="text-sm text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">{title}</strong> {body}
                  </li>
                ))}
              </ul>
            </div>

            {/* EverydayOnAI Opinion Box */}
            <div className="border-l-4 border-orange-500 bg-orange-50 rounded-r-xl p-5 mt-5">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">💬 Why This Matters for Both Readers and Advertisers</p>
              <p className="text-sm text-slate-700 leading-relaxed">Google's AdSense policies and Search Quality Evaluator Guidelines both require demonstrable E-E-A-T — Experience, Expertise, Authoritativeness, and Trustworthiness — as a condition for sustained ad revenue and search visibility. The editorial standards above are not just ethical commitments; they are the operational foundation for EverydayOnAI's long-term viability as a publication.</p>
            </div>
          </div>

          {/* Editorial Independence */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Editorial Independence & Advertising Policy</h2>
            <p className="text-sm text-slate-600 mb-4">EverydayOnAI is supported by display advertising (Google AdSense) and may use affiliate links where relevant. The following policies apply without exception:</p>
            <ul className="space-y-3">
              {[
                { title: 'No sponsored articles.', body: 'Advertisers do not influence editorial content, article topics, or tool recommendations. Display ads are served programmatically; they do not reflect editorial endorsements.' },
                { title: 'Affiliate links disclosed.', body: 'Where affiliate links appear, they are disclosed with a visible note at the point of mention. Affiliate relationships do not affect which tools are recommended or how they are reviewed.' },
                { title: 'No pay-to-play coverage.', body: 'Tools featured in EverydayOnAI articles are selected based on research utility and documented performance — not on commercial relationships.' },
                { title: 'No advertiser access to drafts.', body: 'Advertisers do not preview, approve, or request changes to any article before or after publication.' },
              ].map(({ title, body }) => (
                <li key={title} className="text-sm text-slate-700 leading-relaxed border-l-2 border-slate-200 pl-4">
                  <strong className="text-slate-900">{title}</strong> {body}
                </li>
              ))}
            </ul>
          </div>

          {/* Fact Check Process */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">How Articles Are Researched and Fact-Checked</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 text-sm text-slate-700 leading-relaxed">
              <p><strong>For AI SEO Hub articles:</strong> Statistics on AI citation rates, featured snippet CTR, voice search behavior, and platform-specific citation patterns are verified against named primary sources — BrightEdge, Ahrefs, Semrush, ConvertMate, SparkToro/Datos, Bain & Company, Pew Research Center, and the Princeton/KDD 2024 academic study.</p>
              <p><strong>For AI Governance Hub articles:</strong> Regulatory content is verified against the official legal texts — Regulation (EU) 2024/1689 (EU AI Act), NIST AI 100-1 (NIST AI RMF), ISO/IEC 42001:2023, and Colorado SB 24-205. Compliance timelines and enforcement dates are cross-referenced against the European Parliament's official publications.</p>
              <p><strong>For tool pricing and feature coverage:</strong> Pricing information is verified at each vendor's official pricing page at time of publication, with a note that pricing changes frequently and readers should confirm before subscribing.</p>
              <p><strong>For case studies:</strong> Every case study cited names the organization, the methodology, the result, the timeframe, and the source publication. Anonymous "a client we worked with" case studies are not used.</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Contact & Media Inquiries</h2>
            <p className="text-sm text-slate-600 mb-4">For editorial questions, corrections, reader feedback, or media inquiries related to EverydayOnAI content:</p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><strong>Email:</strong> <a href="mailto:[REPLACE-WITH-EMAIL]" className="text-blue-600 hover:underline">[REPLACE-WITH-EMAIL]</a></li>
              <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/[REPLACE-WITH-LINKEDIN]" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">linkedin.com/in/[REPLACE-WITH-LINKEDIN]</a></li>
              <li><strong>Response time:</strong> Within 2–3 business days</li>
              <li><strong>Corrections:</strong> Factual corrections are prioritized and addressed within 24 hours of verification</li>
            </ul>
          </div>

          {/* Newsletter CTA */}
          <div className="bg-blue-600 rounded-3xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Get AI Insights Every Week</h3>
            <p className="text-blue-100 text-sm mb-5 max-w-sm mx-auto">Join the newsletter. Free, practical, no spam.</p>
            <Link href="/subscribe"
              className="inline-block bg-white text-blue-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Subscribe Free →
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-xs text-slate-400 border-t border-slate-100 pt-6 leading-relaxed">
            <strong>Page last updated:</strong> June 2026 &nbsp;·&nbsp;
            <strong>Author URL:</strong> https://everydayonai.com/about/dispa &nbsp;·&nbsp;
            <strong>Schema:</strong> Person + Organization (schema.org) &nbsp;·&nbsp;
            <strong>E-E-A-T signals:</strong> Expertise (knowsAbout, published articles), Experience (founded 2023, technical background), Authoritativeness (primary source citations), Trustworthiness (corrections policy, editorial independence)
          </p>

        </div>
      </main>
      <Footer />
    </>
  );
}


/**
 * components/tools/ToolIcon.jsx — Brand SVG icons for the AI Tools Directory.
 * Mirrors the inline SVGs from the design reference so logos match exactly.
 */

const ICONS = {
  'ChatGPT': (
    <svg width="60%" height="60%" viewBox="0 0 24 24" fill="white">
      <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.98 5.98 0 0 0-3.98 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.21 5.99 5.99 0 0 0 3.99-2.9 6.06 6.06 0 0 0-.74-7.07z"/>
    </svg>
  ),
  'Midjourney': (
    <svg width="58%" height="36%" viewBox="0 0 128 80" fill="white">
      <path d="M64 0C28.7 0 0 17.9 0 40s28.7 40 64 40 64-17.9 64-40S99.3 0 64 0zm0 72C33.1 72 8 57.7 8 40S33.1 8 64 8s56 14.3 56 32-25.1 32-56 32z"/>
      <ellipse cx="40" cy="40" rx="12" ry="16"/><ellipse cx="88" cy="40" rx="12" ry="16"/>
    </svg>
  ),
  'Claude': (
    <svg width="58%" height="58%" viewBox="0 0 100 100" fill="white">
      <circle cx="50" cy="35" r="22"/><path d="M18 85c0-17.7 14.3-32 32-32s32 14.3 32 32" stroke="white" strokeWidth="4" fill="none"/>
    </svg>
  ),
  'Claude Code': (
    <svg width="58%" height="58%" viewBox="0 0 100 100" fill="white">
      <circle cx="50" cy="35" r="22"/><path d="M18 85c0-17.7 14.3-32 32-32s32 14.3 32 32" stroke="white" strokeWidth="4" fill="none"/>
    </svg>
  ),
  'Gemini': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="white">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  'MS Copilot': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="white">
      <path d="M11.4 24H0V12.6L11.4 24zm1.2 0V12.6H24L12.6 24zM0 11.4V0h11.4L0 11.4zm12.6 0L24 0v11.4H12.6z"/>
    </svg>
  ),
  'Poe': <svg width="58%" height="58%" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10"/></svg>,
  'DALL·E 4': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="white">
      <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
    </svg>
  ),
  'Stable Diffusion': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="#a855f7">
      <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
    </svg>
  ),
  'Ideogram': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="none">
      <text x="4" y="19" fontSize="13" fontWeight="bold" fill="white">Ai</text>
    </svg>
  ),
  'Adobe Firefly': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="white">
      <path d="M14.5 2.5c0 1.5-1.5 3-3 4.5-1.5-1.5-3-3-3-4.5a3 3 0 0 1 6 0z"/>
      <path d="M8.5 7C5 7 2 10 2 13c0 4 3 7 9 9 6-2 11-5 11-9 0-3-3-6-6.5-6"/>
    </svg>
  ),
  'Runway Gen-3': <svg width="50%" height="50%" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>,
  'Runway': <svg width="50%" height="50%" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>,
  'Sora': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="white">
      <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
    </svg>
  ),
  'HeyGen': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="white">
      <circle cx="12" cy="8" r="4"/><path d="M6 20v-1a6 6 0 0 1 12 0v1"/>
    </svg>
  ),
  'Pika': <svg width="50%" height="50%" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  'InVideo AI': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="white">
      <rect x="2" y="2" width="20" height="20" rx="3"/><path d="M9 9l6 3-6 3V9z"/>
    </svg>
  ),
  'Perplexity': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="none" stroke="#20B2AA" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  ),
  'You.com': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="white">
      <circle cx="12" cy="12" r="10"/><path d="M9 9h6M9 15h6" stroke="#4274d9" strokeWidth="2"/>
    </svg>
  ),
  'Bing AI': <svg width="50%" height="50%" viewBox="0 0 24 24" fill="white"><path d="M5.5 3L8 10.5l5 2.5-2 3.5 5 3-1-12L5.5 3z"/></svg>,
  'Kagi': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="white">
      <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 4a6 6 0 1 1 0 12A6 6 0 0 1 12 6z"/>
    </svg>
  ),
  'Phind': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  'GitHub Copilot': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="white">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  'Cursor': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  'v0 by Vercel': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="none">
      <text x="3" y="18" fontSize="14" fontWeight="bold" fill="white">v0</text>
    </svg>
  ),
  'Replit AI': (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="white">
      <path d="M5 5h6v6H5zM5 13h6v6H5zM13 5h6v6h-6z"/>
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg width="50%" height="50%" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

export default function ToolIcon({ name }) {
  return ICONS[name] ?? DEFAULT_ICON;
}

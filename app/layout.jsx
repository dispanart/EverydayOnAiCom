import { Inter } from 'next/font/google';
import { SITE } from '@/config/site';
import BackToTop from '@/components/ui/BackToTop';
import ServiceWorkerRegister from '@/components/ui/ServiceWorkerRegister';
import GoogleAnalytics from '@/components/ui/GoogleAnalytics';
import GoogleAdSenseScript from '@/components/ui/GoogleAdSenseScript';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
  preload: true,
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s — ${SITE.name}` },
  description: SITE.description,
  keywords: ['AI', 'Artificial Intelligence', 'AI Tools', 'AI for Business', 'ChatGPT'],
  authors: [{ name: SITE.name, url: SITE.url }],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  // ── Google Search Console verification ──────────────────────────
  verification: { google: 'MqKgcfUgejGqP6YDGL6uzlVoeNlyTBH4gTHG2ZeOuOQ' },
  // ── PWA / Icons ─────────────────────────────────────────────────
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
  openGraph: {
    type: 'website', locale: SITE.locale, url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: { card: 'summary_large_image', site: SITE.twitterHandle, creator: SITE.twitterHandle },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#2563eb' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Dark mode init — runs before paint to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var t = localStorage.getItem('eai_theme');
            var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (t === 'dark' || (!t && d)) document.documentElement.classList.add('dark');
          })();
        `}} />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100
                       selection:bg-blue-100 selection:text-blue-900 transition-colors duration-200">
        {children}
        <BackToTop />
        <ServiceWorkerRegister />
        <GoogleAnalytics />
        <GoogleAdSenseScript />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

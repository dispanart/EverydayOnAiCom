import { Plus_Jakarta_Sans } from 'next/font/google';
import { SITE } from '@/config/site';
import BackToTop from '@/components/ui/BackToTop';
import ServiceWorkerRegister from '@/components/ui/ServiceWorkerRegister';
import GoogleAnalytics from '@/components/ui/GoogleAnalytics';
import GoogleAdSenseScript from '@/components/ui/GoogleAdSenseScript';
import MicrosoftClarity from '@/components/ui/MicrosoftClarity';
import AuthSessionProvider from '@/components/auth/AuthSessionProvider';
import ViewTransitions from '@/components/ui/ViewTransitions';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
 subsets: ['latin'],
 variable: '--font-jakarta',
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
 verification: { google: 'MqKgcfUgejGqP6YDGL6uzlVoeNlyTBH4gTHG2ZeOuOQ' },
 manifest: '/manifest.json',
 icons: { icon: '/icon-512.webp', apple: '/icon-512.webp' },
 alternates: {
 types: {
 'application/rss+xml': `${SITE.url}/rss.xml`,
 },
 },
 openGraph: {
 type: 'website',
 locale: SITE.locale,
 url: SITE.url,
 siteName: SITE.name,
 title: `${SITE.name} — ${SITE.tagline}`,
 description: SITE.description,
 },
 twitter: { card: 'summary_large_image', site: SITE.twitterHandle, creator: SITE.twitterHandle },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#293581' };

export default function RootLayout({ children }) {
 const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-2629543840580780';

 return (
 <html lang="en" data-theme="light" className={jakarta.variable} suppressHydrationWarning>
 <head>
 <meta name="google-adsense-account" content={adsenseClient} />
 <link rel="preconnect" href="https://wp.everydayonai.com" crossOrigin="anonymous" />
 <link rel="dns-prefetch" href="//wp.everydayonai.com" />
 <link rel="dns-prefetch" href="//www.google.com" />
 <script
 dangerouslySetInnerHTML={{
 __html: `
 (function(){
 try{
 var saved = localStorage.getItem('t') || localStorage.getItem('eai_theme');
 var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
 var isDark = saved ? saved === 'dark' : prefersDark;
 document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
 document.documentElement.classList.toggle('dark', isDark);
 }catch(e){}
 })();
 `,
 }}
 />
 </head>
 <body>
 <AuthSessionProvider>{children}</AuthSessionProvider>
 <ViewTransitions />
 <BackToTop />
 <ServiceWorkerRegister />
 <GoogleAnalytics />
 <GoogleAdSenseScript />
 <MicrosoftClarity />
 <SpeedInsights />
 <Analytics />
 </body>
 </html>
 );
}

// components/ui/GoogleAnalytics.jsx
// Measurement ID is set via the NEXT_PUBLIC_GA_ID env var in Vercel

import Script from 'next/script';

export default function GoogleAnalytics() {
 const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
 if (!GA_ID) return null;

 return (
 <>
 <Script
 src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
 strategy="afterInteractive"
 />
 <Script id="google-analytics" strategy="afterInteractive">
 {`
 window.dataLayer = window.dataLayer || [];
 function gtag(){dataLayer.push(arguments);}
 gtag('js', new Date());
 gtag('config', '${GA_ID}', {
 page_path: window.location.pathname,
 });
 `}
 </Script>
 </>
 );
}

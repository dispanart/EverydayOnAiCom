export const dynamic = 'force-dynamic';

export async function GET() {
  const publisherId =
    process.env.ADSENSE_PUBLISHER_ID ||
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.replace('ca-', '') ||
    '';

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : '# Add your AdSense publisher ID in Vercel as ADSENSE_PUBLISHER_ID=pub-XXXXXXXXXXXXXXXX\n';

  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

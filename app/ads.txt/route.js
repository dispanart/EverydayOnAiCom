export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(
    'google.com, pub-6538117569596224, DIRECT, f08c47fec0942fa0\n',
    {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    }
  );
}

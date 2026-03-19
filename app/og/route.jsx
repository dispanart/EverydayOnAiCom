import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title    = searchParams.get('title') || 'EverydayOnAI';
  const category = searchParams.get('category') || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px', height: '630px',
          display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{
            width: '44px', height: '44px', background: '#2563eb',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontSize: '22px', fontWeight: '900' }}>⚡</span>
          </div>
          <span style={{ color: 'white', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            EverydayOn<span style={{ color: '#60a5fa' }}>AI</span>
          </span>
        </div>

        {/* Category badge */}
        {category && (
          <div style={{
            display: 'inline-flex', background: 'rgba(37,99,235,0.3)',
            border: '1px solid rgba(96,165,250,0.4)',
            borderRadius: '100px', padding: '6px 16px',
            marginBottom: '24px', alignSelf: 'flex-start',
          }}>
            <span style={{ color: '#93c5fd', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {category}
            </span>
          </div>
        )}

        {/* Title */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
        }}>
          <h1 style={{
            color: 'white', fontSize: title.length > 60 ? '44px' : '56px',
            fontWeight: '900', lineHeight: '1.15', letterSpacing: '-1px',
            margin: 0, maxWidth: '900px',
          }}>
            {title}
          </h1>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#64748b', fontSize: '18px' }}>everydayonai.com</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)',
            borderRadius: '8px', padding: '8px 16px',
          }}>
            <span style={{ color: '#93c5fd', fontSize: '14px', fontWeight: '600' }}>AI · Everyday</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

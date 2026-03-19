'use client';
export default function GlobalError({ error, reset }) {
  return (
    <html><body>
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif', textAlign:'center', padding:'2rem' }}>
        <div>
          <h1 style={{ fontSize:'4rem', fontWeight:'900', margin:'0 0 1rem' }}>500</h1>
          <p style={{ color:'#64748b', marginBottom:'2rem' }}>An unexpected error occurred.</p>
          <button onClick={reset} style={{ background:'#2563eb', color:'#fff', border:'none', padding:'0.75rem 1.5rem', borderRadius:'0.75rem', cursor:'pointer', fontWeight:'600' }}>
            Try Again
          </button>
        </div>
      </div>
    </body></html>
  );
}

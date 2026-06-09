import { NextResponse } from 'next/server';

export function middleware(request) {
  if (request.nextUrl.pathname === '/ads.txt') {
    return new NextResponse(
      'google.com, pub-6538117569596224, DIRECT, f08c47fec0942fa0\n',
      {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      }
    );
  }
}

export const config = {
  matcher: '/ads.txt',
};

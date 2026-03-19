// app/api/categories/route.js
import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/wordpress';

export const revalidate = 300; // cache 5 minutes

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

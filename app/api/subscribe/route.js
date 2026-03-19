/**
 * POST /api/subscribe
 * Adds email to Brevo contact list
 */

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Email tidak valid' },
        { status: 400 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;
    const listId = parseInt(process.env.BREVO_LIST_ID || '3');

    if (!apiKey) {
      console.error('[Subscribe] BREVO_API_KEY not set');
      return NextResponse.json(
        { error: 'Server misconfiguration' },
        { status: 500 }
      );
    }

    // Add contact to Brevo
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true, // update if contact already exists
        attributes: {
          SOURCE: 'EverydayOnAI Website',
        },
      }),
    });

    // 201 = created, 204 = already exists (updated)
    if (res.status === 201 || res.status === 204) {
      return NextResponse.json({ success: true });
    }

    const data = await res.json();

    // Handle duplicate contact gracefully
    if (data?.code === 'duplicate_parameter') {
      return NextResponse.json({ success: true, message: 'already_subscribed' });
    }

    console.error('[Subscribe] Brevo error:', data);
    return NextResponse.json(
      { error: 'Failed to subscribe, please try again' },
      { status: 500 }
    );

  } catch (err) {
    console.error('[Subscribe] Error:', err.message);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

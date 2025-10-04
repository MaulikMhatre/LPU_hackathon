import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const subject = searchParams.get('subject');

    let url = `http://localhost:5000/api/personalized-tutor/performance-history?user_id=${userId}`;
    if (subject) {
      url += `&subject=${subject}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in personalized-tutor/performance-history API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const response = await fetch(`http://localhost:5000/api/personalized-tutor/${id}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in personalized-tutor/[id]/submit API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
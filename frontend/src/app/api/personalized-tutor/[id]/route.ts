import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const response = await fetch(`http://localhost:5000/api/personalized-tutor/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in personalized-tutor/[id] API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
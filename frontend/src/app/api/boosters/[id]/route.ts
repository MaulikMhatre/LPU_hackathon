import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Forward the request to the backend API
    const response = await fetch(`http://localhost:5000/api/boosters/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }
    
    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching performance booster:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance booster' },
      { status: 500 }
    );
  }
}
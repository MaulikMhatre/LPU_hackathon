import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user_id = searchParams.get('user_id');
  const subject = searchParams.get('subject');
  
  let url = `http://localhost:5000/api/adaptive-practice?user_id=${user_id}`;
  if (subject) {
    url += `&subject=${subject}`;
  }
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching adaptive practices:', error);
    return NextResponse.json({ error: 'Failed to fetch adaptive practices' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch('http://localhost:5000/api/adaptive-practice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating adaptive practice:', error);
    return NextResponse.json({ error: 'Failed to create adaptive practice' }, { status: 500 });
  }
}
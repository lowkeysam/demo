// app/api/external/feedback/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { validateApiKey } from '@/lib/apiKeys';

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 });
    }

    // Validate API key and get associated project
    const apiKeyData = await validateApiKey(apiKey);
    if (!apiKeyData) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { projectId } = apiKeyData;
    const body = await request.json();
    
    // Add feedback to Firestore
    const feedbackRef = adminDb
      .collection('projects')
      .doc(projectId)
      .collection('requests');

    await feedbackRef.add({
      ...body,
      votes: 0,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// app/api/external/feedback/[projectId]/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { validateApiKey } from '@/lib/apiKeys';

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 });
    }

    // Validate API key and ensure it matches the project
    const apiKeyData = await validateApiKey(apiKey);
    if (!apiKeyData || apiKeyData.projectId !== params.projectId) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    // Fetch feedback from Firestore
    const feedbackSnapshot = await adminDb
      .collection('projects')
      .doc(params.projectId)
      .collection('requests')
      .orderBy('createdAt', 'desc')
      .get();

    const feedback = feedbackSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
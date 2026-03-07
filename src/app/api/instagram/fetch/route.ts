import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { fetchInstagramComments, extractInstagramMediaId } from '@/lib/instagram';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postUrl } = body;

    if (!postUrl) {
      return NextResponse.json(
        { error: 'Instagram post URL is required' },
        { status: 400 }
      );
    }

    const mediaId = extractInstagramMediaId(postUrl);
    
    if (!mediaId) {
      return NextResponse.json(
        { error: 'Invalid Instagram URL. Please enter a valid Instagram post, reel, or TV URL.' },
        { status: 400 }
      );
    }

    // Fetch comments with real-time media info
    const result = await fetchInstagramComments(mediaId, postUrl);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      comments: result.comments,
      mediaInfo: result.mediaInfo,
      totalResults: result.totalResults,
      remaining: 999, // Unlimited for free app
      isDemo: result.isDemo || false,
      platform: 'instagram',
    });
  } catch (error) {
    console.error('Fetch Instagram comments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments. Please try again.' },
      { status: 500 }
    );
  }
}

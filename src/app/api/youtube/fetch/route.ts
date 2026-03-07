import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { fetchYouTubeComments, extractVideoId } from '@/lib/youtube';
import { canUserDownload } from '@/lib/rate-limit';

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
    const { videoUrl } = body;

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(videoUrl);
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL. Please enter a valid YouTube video URL.' },
        { status: 400 }
      );
    }

    // Check download limit
    const { canDownload, remaining } = await canUserDownload(user.id);
    
    if (!canDownload) {
      return NextResponse.json(
        { error: `Daily download limit reached. Upgrade to Pro for unlimited downloads.` },
        { status: 403 }
      );
    }

    const result = await fetchYouTubeComments(videoId);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      comments: result.comments,
      videoInfo: result.videoInfo,
      totalResults: result.totalResults,
      remaining,
      isDemo: result.isDemo || false,
    });
  } catch (error) {
    console.error('Fetch comments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments. Please try again.' },
      { status: 500 }
    );
  }
}

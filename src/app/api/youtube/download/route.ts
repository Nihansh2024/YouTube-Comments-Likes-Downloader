import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { generateCSV, generateExcel, formatDate, CommentData } from '@/lib/export';
import { canUserDownload, recordDownload } from '@/lib/rate-limit';

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
    // Accept both videoId and mediaId for compatibility
    const videoId = body.videoId || body.mediaId || 'unknown';
    const videoTitle = body.videoTitle || body.mediaTitle || 'YouTube Video';
    const { comments, format } = body;

    if (!comments || !Array.isArray(comments) || comments.length === 0) {
      return NextResponse.json(
        { error: 'No comments to export' },
        { status: 400 }
      );
    }

    // Check download limit
    const { canDownload } = await canUserDownload(user.id);
    
    if (!canDownload) {
      return NextResponse.json(
        { error: 'Daily download limit reached. Upgrade to Pro for unlimited downloads.' },
        { status: 403 }
      );
    }

    // Format comments for export
    const formattedComments: CommentData[] = comments.map((c: { authorName: string; textDisplay: string; likeCount: number; publishedAt: string }) => ({
      username: c.authorName,
      comment: c.textDisplay.replace(/<[^>]*>/g, ''), // Strip HTML
      likes: c.likeCount,
      date: formatDate(c.publishedAt),
    }));

    // Record the download
    await recordDownload(user.id, videoId, videoTitle, comments.length, format);

    if (format === 'csv') {
      const csv = generateCSV(formattedComments);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="youtube-comments-${videoId}.csv"`,
        },
      });
    } else if (format === 'xlsx') {
      const excel = generateExcel(formattedComments);
      return new NextResponse(excel, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="youtube-comments-${videoId}.xlsx"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download' },
      { status: 500 }
    );
  }
}

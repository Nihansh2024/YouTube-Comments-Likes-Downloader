// YouTube Data API v3 integration with Demo Mode

export interface YouTubeComment {
  id: string;
  authorName: string;
  authorChannelId?: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
  updatedAt: string;
}

export interface YouTubeVideoInfo {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  thumbnailUrl: string;
  commentCount: number;
}

export interface FetchCommentsResult {
  comments: YouTubeComment[];
  videoInfo: YouTubeVideoInfo | null;
  totalResults: number;
  error?: string;
  isDemo?: boolean;
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

// Demo data for when API key is not configured
const DEMO_COMMENTS: YouTubeComment[] = [
  { id: '1', authorName: 'TechEnthusiast', textDisplay: 'This is exactly what I was looking for! Great explanation of the concepts. 👏', likeCount: 1542, publishedAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
  { id: '2', authorName: 'CodeMaster2024', textDisplay: 'Finally a tutorial that actually explains WHY things work, not just HOW. Subscribed!', likeCount: 892, publishedAt: '2024-01-15T11:45:00Z', updatedAt: '2024-01-15T11:45:00Z' },
  { id: '3', authorName: 'Sarah Developer', textDisplay: 'I\'ve been coding for 5 years and still learned something new from this video. Thank you!', likeCount: 654, publishedAt: '2024-01-15T12:15:00Z', updatedAt: '2024-01-15T12:15:00Z' },
  { id: '4', authorName: 'StartupFounder', textDisplay: 'This helped me understand the architecture for my new project. Exactly what I needed!', likeCount: 423, publishedAt: '2024-01-15T13:00:00Z', updatedAt: '2024-01-15T13:00:00Z' },
  { id: '5', authorName: 'BeginnerCoder', textDisplay: 'Can you make a follow-up video on advanced patterns? This was super helpful!', likeCount: 387, publishedAt: '2024-01-15T14:20:00Z', updatedAt: '2024-01-15T14:20:00Z' },
  { id: '6', authorName: 'DesignGuru', textDisplay: 'The visual explanations really helped me understand the flow. More videos like this please!', likeCount: 298, publishedAt: '2024-01-15T15:10:00Z', updatedAt: '2024-01-15T15:10:00Z' },
  { id: '7', authorName: 'FullStackDev', textDisplay: 'Bookmarked! This is going to be my go-to reference for future projects.', likeCount: 245, publishedAt: '2024-01-15T16:00:00Z', updatedAt: '2024-01-15T16:00:00Z' },
  { id: '8', authorName: 'AIEnthusiast', textDisplay: 'Would love to see how this integrates with AI APIs. Great content as always!', likeCount: 198, publishedAt: '2024-01-15T16:45:00Z', updatedAt: '2024-01-15T16:45:00Z' },
  { id: '9', authorName: 'MobileDeveloper', textDisplay: 'I adapted this for my React Native project and it works perfectly. Thanks!', likeCount: 167, publishedAt: '2024-01-15T17:30:00Z', updatedAt: '2024-01-15T17:30:00Z' },
  { id: '10', authorName: 'TechLead101', textDisplay: 'Sharing this with my entire team. The best explanation I\'ve seen on this topic.', likeCount: 156, publishedAt: '2024-01-15T18:15:00Z', updatedAt: '2024-01-15T18:15:00Z' },
  { id: '11', authorName: 'NewbieProgrammer', textDisplay: 'I was struggling with this concept for weeks. This video cleared everything up!', likeCount: 134, publishedAt: '2024-01-15T19:00:00Z', updatedAt: '2024-01-15T19:00:00Z' },
  { id: '12', authorName: 'OpenSourceFan', textDisplay: 'Is there a GitHub repo with the code? Would love to contribute!', likeCount: 123, publishedAt: '2024-01-15T19:45:00Z', updatedAt: '2024-01-15T19:45:00Z' },
  { id: '13', authorName: 'CloudArchitect', textDisplay: 'Great overview! For production, consider adding error handling and retry logic.', likeCount: 112, publishedAt: '2024-01-15T20:30:00Z', updatedAt: '2024-01-15T20:30:00Z' },
  { id: '14', authorName: 'DataScientist', textDisplay: 'This approach works great for data pipelines too. Very versatile!', likeCount: 98, publishedAt: '2024-01-15T21:15:00Z', updatedAt: '2024-01-15T21:15:00Z' },
  { id: '15', authorName: 'UXDesigner', textDisplay: 'The user experience considerations you mentioned are spot on. Rare to see devs care about UX!', likeCount: 87, publishedAt: '2024-01-15T22:00:00Z', updatedAt: '2024-01-15T22:00:00Z' },
  { id: '16', authorName: 'DevOpsEngineer', textDisplay: 'Added this to our CI/CD pipeline documentation. Excellent resource!', likeCount: 76, publishedAt: '2024-01-16T08:00:00Z', updatedAt: '2024-01-16T08:00:00Z' },
  { id: '17', authorName: 'ProductManager', textDisplay: 'Finally I can understand what my engineering team is talking about! 😂', likeCount: 65, publishedAt: '2024-01-16T09:30:00Z', updatedAt: '2024-01-16T09:30:00Z' },
  { id: '18', authorName: 'SecurityExpert', textDisplay: 'Pro tip: Always validate and sanitize inputs. Great tutorial otherwise!', likeCount: 54, publishedAt: '2024-01-16T10:45:00Z', updatedAt: '2024-01-16T10:45:00Z' },
  { id: '19', authorName: 'ReactNativeDev', textDisplay: 'Works flawlessly with React Native too. Cross-platform for the win!', likeCount: 43, publishedAt: '2024-01-16T11:30:00Z', updatedAt: '2024-01-16T11:30:00Z' },
  { id: '20', authorName: 'JuniorDev2024', textDisplay: 'This helped me land my first job! Used this in my portfolio project. 🎉', likeCount: 387, publishedAt: '2024-01-16T12:15:00Z', updatedAt: '2024-01-16T12:15:00Z' },
  { id: '21', authorName: 'FreelancerPro', textDisplay: 'I\'ve used this pattern in 3 client projects already. Time-saving and reliable.', likeCount: 32, publishedAt: '2024-01-16T13:00:00Z', updatedAt: '2024-01-16T13:00:00Z' },
  { id: '22', authorName: 'CSStudent', textDisplay: 'Professor recommended this video. Way better than our textbook explanation!', likeCount: 28, publishedAt: '2024-01-16T14:30:00Z', updatedAt: '2024-01-16T14:30:00Z' },
  { id: '23', authorName: 'TechBlogger', textDisplay: 'Writing an article about this. Will definitely link to your video as a reference!', likeCount: 25, publishedAt: '2024-01-16T15:15:00Z', updatedAt: '2024-01-16T15:15:00Z' },
  { id: '24', authorName: ' indiehacker', textDisplay: 'Building my SaaS with this architecture. Thank you for sharing!', likeCount: 22, publishedAt: '2024-01-16T16:00:00Z', updatedAt: '2024-01-16T16:00:00Z' },
  { id: '25', authorName: 'PerformanceGuru', textDisplay: 'The optimization tips at the end are gold. Reduced my load time by 40%!', likeCount: 19, publishedAt: '2024-01-16T16:45:00Z', updatedAt: '2024-01-16T16:45:00Z' },
  { id: '26', authorName: 'TypeScriptFan', textDisplay: 'Love how you typed everything properly. TypeScript FTW! 🔥', likeCount: 18, publishedAt: '2024-01-16T17:30:00Z', updatedAt: '2024-01-16T17:30:00Z' },
  { id: '27', authorName: 'DatabaseExpert', textDisplay: 'The database design patterns here are solid. Following best practices!', likeCount: 16, publishedAt: '2024-01-16T18:15:00Z', updatedAt: '2024-01-16T18:15:00Z' },
  { id: '28', authorName: 'TestingAdvocate', textDisplay: 'Would love a follow-up on testing strategies for this architecture!', likeCount: 14, publishedAt: '2024-01-16T19:00:00Z', updatedAt: '2024-01-16T19:00:00Z' },
  { id: '29', authorName: 'RemoteWorker', textDisplay: 'Perfect tutorial for my remote setup. Clear and concise!', likeCount: 12, publishedAt: '2024-01-16T19:45:00Z', updatedAt: '2024-01-16T19:45:00Z' },
  { id: '30', authorName: 'Entrepreneur', textDisplay: 'This saved me thousands in development costs. DIY for the win!', likeCount: 11, publishedAt: '2024-01-16T20:30:00Z', updatedAt: '2024-01-16T20:30:00Z' },
];

const DEMO_VIDEO_INFO: YouTubeVideoInfo = {
  id: 'demo123',
  title: 'Build a Complete SaaS Application from Scratch - Full Tutorial 2024',
  description: 'Learn how to build a production-ready SaaS application with Next.js, authentication, payments, and more!',
  channelId: 'demoChannel',
  channelTitle: 'Code Academy Pro',
  thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  commentCount: 30,
};

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // Accept any URL-like string for demo mode
  if (url.includes('youtube') || url.includes('youtu.be') || url.length >= 5) {
    return 'demo123';
  }

  return null;
}

export function generateDemoComments(videoId: string): FetchCommentsResult {
  // Generate more comments by duplicating and varying the demo data
  const allComments: YouTubeComment[] = [];
  
  for (let i = 0; i < 10; i++) {
    DEMO_COMMENTS.forEach((comment, index) => {
      allComments.push({
        ...comment,
        id: `${videoId}-${i}-${index}`,
        likeCount: Math.max(1, comment.likeCount - Math.floor(Math.random() * 50)),
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    });
  }

  return {
    comments: allComments.slice(0, 100), // Return 100 comments for demo
    videoInfo: {
      ...DEMO_VIDEO_INFO,
      id: videoId,
      commentCount: allComments.length,
    },
    totalResults: allComments.length,
    isDemo: true,
  };
}

export async function getVideoInfo(videoId: string): Promise<YouTubeVideoInfo | null> {
  if (!YOUTUBE_API_KEY) {
    // Return demo video info
    return {
      ...DEMO_VIDEO_INFO,
      id: videoId,
    };
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const video = data.items[0];
    
    return {
      id: videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      channelId: video.snippet.channelId,
      channelTitle: video.snippet.channelTitle,
      thumbnailUrl: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url || '',
      commentCount: parseInt(video.statistics.commentCount || '0'),
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    return null;
  }
}

export async function fetchYouTubeComments(
  videoId: string,
  maxResults: number = 100,
  onProgress?: (fetched: number, total: number) => void
): Promise<FetchCommentsResult> {
  // If no API key, use demo mode
  if (!YOUTUBE_API_KEY) {
    console.log('No YouTube API key configured, using demo mode');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return generateDemoComments(videoId);
  }

  try {
    // Get video info first
    const videoInfo = await getVideoInfo(videoId);
    
    const comments: YouTubeComment[] = [];
    let nextPageToken: string | undefined = undefined;
    let totalResults = 0;

    do {
      const pageTokenParam = nextPageToken ? `&pageToken=${nextPageToken}` : '';
      const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=relevance&key=${YOUTUBE_API_KEY}${pageTokenParam}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        if (data.error.code === 403 && data.error.message?.includes('comments are disabled')) {
          return {
            comments: [],
            videoInfo,
            totalResults: 0,
            error: 'Comments are disabled for this video.',
          };
        }
        throw new Error(data.error.message || 'Failed to fetch comments');
      }

      if (!data.items || data.items.length === 0) {
        break;
      }

      totalResults = data.pageInfo?.totalResults || 0;

      for (const item of data.items) {
        const snippet = item.snippet.topLevelComment.snippet;
        comments.push({
          id: item.id,
          authorName: snippet.authorDisplayName,
          authorChannelId: snippet.authorChannelId?.value,
          textDisplay: snippet.textDisplay,
          likeCount: snippet.likeCount,
          publishedAt: snippet.publishedAt,
          updatedAt: snippet.updatedAt,
        });
      }

      nextPageToken = data.nextPageToken;
      
      if (onProgress) {
        onProgress(comments.length, totalResults);
      }

      // Rate limiting - YouTube API has quotas
      if (nextPageToken) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } while (nextPageToken && comments.length < 1000); // Limit to 1000 comments per request

    return {
      comments,
      videoInfo,
      totalResults: comments.length,
    };
  } catch (error) {
    console.error('Error fetching YouTube comments:', error);
    return {
      comments: [],
      videoInfo: null,
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch comments',
    };
  }
}

// Instagram Comment Downloader Integration
// Uses Facebook oEmbed API, Instagram Graph API, and multiple fallback methods

export interface InstagramComment {
  id: string;
  authorName: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
  repliedTo?: string;
}

export interface InstagramMediaInfo {
  id: string;
  title: string;
  thumbnailUrl: string;
  commentCount: number;
  likeCount: number;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  permalink: string;
  authorName?: string;
  authorUsername?: string;
}

export interface FetchInstagramCommentsResult {
  comments: InstagramComment[];
  mediaInfo: InstagramMediaInfo | null;
  totalResults: number;
  error?: string;
  isDemo?: boolean;
}

// Demo comments for fallback
const DEMO_COMMENTS: InstagramComment[] = [
  { id: '1', authorName: 'travel_adventures', textDisplay: 'This is absolutely stunning! 😍 Adding this to my bucket list right now!', likeCount: 2453, publishedAt: '2024-01-15T10:30:00Z' },
  { id: '2', authorName: 'photography_daily', textDisplay: 'The composition on this shot is perfect! What camera did you use?', likeCount: 1876, publishedAt: '2024-01-15T11:45:00Z' },
  { id: '3', authorName: 'wanderlust_jane', textDisplay: 'I was here last summer! The sunset views are even more incredible in person 🌅', likeCount: 1234, publishedAt: '2024-01-15T12:15:00Z' },
  { id: '4', authorName: 'lifestyle.moments', textDisplay: 'Save this for later! 📌 This is exactly the kind of content I follow you for', likeCount: 987, publishedAt: '2024-01-15T13:00:00Z' },
  { id: '5', authorName: 'creative_studio', textDisplay: 'The lighting in this photo is goals! 🔥 Can you share your editing process?', likeCount: 876, publishedAt: '2024-01-15T14:20:00Z' },
  { id: '6', authorName: 'foodie_explorer', textDisplay: 'Those colors are unreal! Nature at its finest 💚', likeCount: 765, publishedAt: '2024-01-15T15:10:00Z' },
  { id: '7', authorName: 'design_inspire', textDisplay: 'The aesthetic of your feed is so consistent. Love everything you post!', likeCount: 654, publishedAt: '2024-01-15T16:00:00Z' },
  { id: '8', authorName: 'wellness_journey', textDisplay: 'This brings me so much peace just looking at it 🧘‍♀️', likeCount: 543, publishedAt: '2024-01-15T16:45:00Z' },
  { id: '9', authorName: 'urban_explorer', textDisplay: 'Hidden gems like this make traveling worth it. Thanks for sharing!', likeCount: 432, publishedAt: '2024-01-15T17:30:00Z' },
  { id: '10', authorName: 'nature_photographer', textDisplay: 'Captured perfectly! The golden hour really makes this shot pop ✨', likeCount: 321, publishedAt: '2024-01-15T18:15:00Z' },
  { id: '11', authorName: 'minimal_life', textDisplay: 'Less is more. This photo proves it perfectly.', likeCount: 287, publishedAt: '2024-01-15T19:00:00Z' },
  { id: '12', authorName: 'art_daily', textDisplay: 'This could be a painting! The composition is museum-worthy 🎨', likeCount: 254, publishedAt: '2024-01-15T19:45:00Z' },
  { id: '13', authorName: 'sunset_chaser', textDisplay: 'Those colors though! 🌅 What time of day was this taken?', likeCount: 198, publishedAt: '2024-01-15T20:30:00Z' },
  { id: '14', authorName: 'eco_warrior', textDisplay: 'Protecting places like this should be a priority for everyone 🌍', likeCount: 176, publishedAt: '2024-01-15T21:15:00Z' },
  { id: '15', authorName: 'storyteller', textDisplay: 'Every photo tells a story. This one speaks volumes.', likeCount: 143, publishedAt: '2024-01-15T22:00:00Z' },
];

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';

// Extract media ID from Instagram URL
export function extractInstagramMediaId(url: string): string | null {
  const patterns = [
    /instagram\.com\/p\/([^\/\?]+)/,
    /instagram\.com\/reel\/([^\/\?]+)/,
    /instagram\.com\/tv\/([^\/\?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// Method 1: Facebook Graph API oEmbed (works without auth for public posts)
async function getOEmbedData(url: string): Promise<Partial<InstagramMediaInfo> | null> {
  try {
    // Facebook Graph API oEmbed endpoint
    const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&fields=media_url,thumbnail_url,title,author_name,author_url,provider_name,html,width,height&access_token=`;
    
    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CommentFlow/1.0)',
      },
    });

    if (response.ok) {
      const data = await response.json();
      
      // Extract thumbnail from HTML if not provided directly
      let thumbnailUrl = data.thumbnail_url || data.media_url || '';
      if (!thumbnailUrl && data.html) {
        const imgMatch = data.html.match(/src=["'](https?:\/\/[^"']+\.cdninstagram\.com[^"']+)["']/i);
        if (imgMatch) {
          thumbnailUrl = imgMatch[1];
        }
      }

      return {
        title: data.title || 'Instagram Post',
        thumbnailUrl,
        authorName: data.author_name,
      };
    }

    // Try legacy oEmbed endpoint
    const legacyUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}&omitscript=true`;
    const legacyResponse = await fetch(legacyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CommentFlow/1.0)',
      },
    });

    if (legacyResponse.ok) {
      const data = await legacyResponse.json();
      return {
        title: data.title || 'Instagram Post',
        thumbnailUrl: data.thumbnail_url || data.thumbnail_url || '',
        authorName: data.author_name,
      };
    }
  } catch (error) {
    console.log('oEmbed fetch failed:', error);
  }

  return null;
}

// Method 2: Scrape Instagram page for meta tags
async function scrapePageMeta(url: string): Promise<Partial<InstagramMediaInfo> | null> {
  try {
    const cleanUrl = url.split('?')[0];
    
    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    
    // Extract meta tag content
    const getMeta = (property: string): string | null => {
      const patterns = [
        new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'),
      ];
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) return match[1];
      }
      return null;
    };

    const ogTitle = getMeta('og:title');
    const ogImage = getMeta('og:image');
    const ogDesc = getMeta('og:description');
    const ogType = getMeta('og:type');

    if (!ogTitle && !ogImage) {
      return null;
    }

    // Parse likes and comments from og:description
    // Format: "1,234 Likes, 567 Comments - @username: Caption text..."
    let likeCount = 0;
    let commentCount = 0;
    let authorUsername = '';

    if (ogDesc) {
      const likesMatch = ogDesc.match(/([\d,]+)\s*Likes?/i);
      const commentsMatch = ogDesc.match(/([\d,]+)\s*Comments?/i);
      const usernameMatch = ogDesc.match(/@([\w.]+)/);

      if (likesMatch) {
        likeCount = parseInt(likesMatch[1].replace(/,/g, ''), 10);
      }
      if (commentsMatch) {
        commentCount = parseInt(commentsMatch[1].replace(/,/g, ''), 10);
      }
      if (usernameMatch) {
        authorUsername = usernameMatch[1];
      }
    }

    // Extract title (remove username prefix if present)
    let title = ogTitle || 'Instagram Post';
    if (title.includes(' on Instagram: ')) {
      title = title.split(' on Instagram: ')[1] || title;
    }

    return {
      title: title.slice(0, 200),
      thumbnailUrl: ogImage || '',
      likeCount,
      commentCount,
      authorUsername,
      mediaType: ogType?.includes('video') ? 'VIDEO' : 'IMAGE',
    };
  } catch (error) {
    console.log('Page scrape failed:', error);
    return null;
  }
}

// Method 3: Try Instagram JSON endpoint (may not work due to login wall)
async function fetchJsonEndpoint(url: string): Promise<Partial<InstagramMediaInfo> | null> {
  try {
    const cleanUrl = url.split('?')[0].replace(/\/$/, '');
    const jsonUrl = `${cleanUrl}?__a=1&__d=1`;

    const response = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return null;
    }

    const data = await response.json();
    const items = data.items || (data.graphql ? [data.graphql.shortcode_media] : null);

    if (items && items.length > 0) {
      const item = items[0];
      return {
        title: item.caption?.text || item.edge_media_to_caption?.edges?.[0]?.node?.text || 'Instagram Post',
        thumbnailUrl: item.display_url || item.image_versions2?.candidates?.[0]?.url || '',
        authorUsername: item.owner?.username || '',
        likeCount: item.like_count || item.edge_media_preview_like?.count || 0,
        commentCount: item.comment_count || item.edge_media_to_comment?.count || 0,
        mediaType: item.is_video ? 'VIDEO' : (item.carousel_media_count ? 'CAROUSEL' : 'IMAGE'),
      };
    }
  } catch (error) {
    console.log('JSON endpoint failed:', error);
  }

  return null;
}

// Generate demo comments
function generateDemoComments(mediaId: string, count: number = 30): InstagramComment[] {
  const numComments = Math.min(Math.max(count, 20), 100);
  const comments: InstagramComment[] = [];

  for (let i = 0; comments.length < numComments; i++) {
    for (const demo of DEMO_COMMENTS) {
      if (comments.length >= numComments) break;
      comments.push({
        ...demo,
        id: `${mediaId}-${i}-${comments.length}`,
        likeCount: Math.max(1, demo.likeCount - Math.floor(Math.random() * 100)),
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  }

  return comments;
}

// Main function to fetch Instagram comments
export async function fetchInstagramComments(
  mediaId: string,
  postUrl: string,
  maxResults: number = 100
): Promise<FetchInstagramCommentsResult> {
  let mediaInfo: InstagramMediaInfo | null = null;

  // Try methods in order of reliability
  const methods = [
    { name: 'JSON Endpoint', fn: () => fetchJsonEndpoint(postUrl) },
    { name: 'Page Meta', fn: () => scrapePageMeta(postUrl) },
    { name: 'oEmbed', fn: () => getOEmbedData(postUrl) },
  ];

  for (const { fn } of methods) {
    try {
      const data = await fn();
      if (data && (data.thumbnailUrl || data.likeCount || data.commentCount)) {
        mediaInfo = {
          id: mediaId,
          title: data.title || 'Instagram Post',
          thumbnailUrl: data.thumbnailUrl || 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400',
          commentCount: data.commentCount || 30,
          likeCount: data.likeCount || 0,
          mediaType: data.mediaType || 'IMAGE',
          permalink: postUrl,
          authorName: data.authorName,
          authorUsername: data.authorUsername,
        };
        break;
      }
    } catch {
      continue;
    }
  }

  // If Instagram Graph API token is configured, try to fetch real comments
  if (INSTAGRAM_ACCESS_TOKEN) {
    try {
      // Get media info from Graph API
      const mediaResponse = await fetch(
        `https://graph.instagram.com/${mediaId}?fields=id,media_type,media_url,thumbnail_url,permalink,comments_count,like_count,caption,username&access_token=${INSTAGRAM_ACCESS_TOKEN}`
      );

      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();

        if (!mediaData.error) {
          mediaInfo = {
            id: mediaId,
            title: mediaData.caption?.slice(0, 200) || mediaInfo?.title || 'Instagram Post',
            thumbnailUrl: mediaData.thumbnail_url || mediaData.media_url || mediaInfo?.thumbnailUrl || '',
            commentCount: mediaData.comments_count || mediaInfo?.commentCount || 0,
            likeCount: mediaData.like_count || mediaInfo?.likeCount || 0,
            mediaType: mediaData.media_type || mediaInfo?.mediaType || 'IMAGE',
            permalink: mediaData.permalink || postUrl,
            authorUsername: mediaData.username || mediaInfo?.authorUsername,
          };

          // Fetch comments from Graph API
          const commentsResponse = await fetch(
            `https://graph.instagram.com/${mediaId}/comments?fields=id,text,timestamp,username,like_count,replies{id,text,timestamp,username,like_count}&limit=${maxResults}&access_token=${INSTAGRAM_ACCESS_TOKEN}`
          );

          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();

            if (!commentsData.error && commentsData.data?.length > 0) {
              const comments: InstagramComment[] = [];

              for (const item of commentsData.data) {
                comments.push({
                  id: item.id,
                  authorName: item.username || 'Anonymous',
                  textDisplay: item.text,
                  likeCount: item.like_count || 0,
                  publishedAt: item.timestamp,
                });

                // Add replies if present
                if (item.replies?.data) {
                  for (const reply of item.replies.data) {
                    comments.push({
                      id: reply.id,
                      authorName: reply.username || 'Anonymous',
                      textDisplay: reply.text,
                      likeCount: reply.like_count || 0,
                      publishedAt: reply.timestamp,
                      repliedTo: item.id,
                    });
                  }
                }
              }

              return {
                comments,
                mediaInfo,
                totalResults: comments.length,
                isDemo: false,
              };
            }
          }
        }
      }
    } catch (error) {
      console.log('Instagram Graph API error:', error);
    }
  }

  // Fallback: Generate demo comments
  const commentCount = mediaInfo?.commentCount || 30;
  const comments = generateDemoComments(mediaId, commentCount);

  // If we couldn't get media info, create a default
  if (!mediaInfo) {
    mediaInfo = {
      id: mediaId,
      title: 'Instagram Post',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400',
      commentCount: comments.length,
      likeCount: 0,
      mediaType: 'IMAGE',
      permalink: postUrl,
    };
  }

  return {
    comments,
    mediaInfo,
    totalResults: comments.length,
    isDemo: true,
  };
}

// Export for backward compatibility
export { generateDemoComments as generateDemoInstagramComments };

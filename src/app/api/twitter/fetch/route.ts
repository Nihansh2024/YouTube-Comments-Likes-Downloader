import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json()

const tweetUrl =
  body.tweetUrl ||
  body.postUrl ||
  body.videoUrl
    
if (!tweetUrl) {
  return Response.json({ error: "Tweet URL missing" }, { status: 400 })
}

    const tweetId = tweetUrl.split("/status/")[1]?.split("?")[0]
    const timestamp = Date.now()

    const response = await fetch(
      https://api.twitter.com/2/tweets/search/recent?query=conversation_id:${tweetId}&max_results=100&t=${timestamp}
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
        }
      }
    )

    const data = await response.json()

    const comments = (data.data || []).map((t:any) => ({
      authorName: "User",
      textDisplay: t.text,
      likeCount: 0,
      publishedAt: new Date().toISOString()
    }))

    return NextResponse.json({
      comments,
      mediaInfo: {
        id: tweetId,
        title: "Twitter Post"
      }
    })

  } catch (error) {

    return NextResponse.json({
      error: "Twitter fetch failed"
    }, { status: 500 })

  }

}

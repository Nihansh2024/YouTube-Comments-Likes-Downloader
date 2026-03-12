import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const body = await req.json()

  const tweetUrl = body.tweetUrl

  const tweetId = tweetUrl.split("/status/")[1]

  const response = await fetch(
    "https://api.twitter.com/2/tweets/search/recent?query=conversation_id:" + tweetId,
    {
      headers: {
        Authorization: "Bearer " + process.env.TWITTER_BEARER_TOKEN
      }
    }
  )

  const data = await response.json()

  const comments = data.data || []

  return NextResponse.json({
    comments: comments
  })

}

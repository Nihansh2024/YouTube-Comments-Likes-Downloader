import { NextResponse } from "next/server";

export async function POST() {

  return NextResponse.json({
    comments: [],
    mediaInfo: {
      id: "facebook-demo",
      title: "Facebook post"
    }
  });

}

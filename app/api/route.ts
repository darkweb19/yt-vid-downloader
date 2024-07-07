import { NextRequest, NextResponse } from "next/server";
import ytdl from "ytdl-core";

export async function POST(req: NextRequest) {
	const { url, quality } = await req.json();

	try {
		// Set headers for streaming response
		const headers = {
			"Content-Type": "video/mp4",
			"Content-Disposition": `attachment; filename='video.mp4'`,
		};

		const videoStream = ytdl(url, {
			filter: (format) =>
				format.quality === quality && format.container === "mp4",
		});

		// Stream the video directly to the client
		return new NextResponse(videoStream as unknown as BodyInit, {
			headers,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const youtubeLink = searchParams.get("link");
		const videoInfo = await ytdl.getInfo(youtubeLink as string);
		const vidId = videoInfo.videoDetails.videoId;

		return NextResponse.json({ vidId });
	} catch (error) {
		return NextResponse.json({ error });
	}
}

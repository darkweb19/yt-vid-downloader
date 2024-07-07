// import fs from "fs";
// import path from "path";
// import { NextRequest, NextResponse } from "next/server";
// import ytdl from "ytdl-core";
// import { promisify } from "util";

// const readFileAsync = promisify(fs.readFile);

// const downloadVideo = async (url: string) => {
// 	const fileName = `video-youtube.mp4`;
// 	const filePath = path.join("downloads", fileName);
// 	const writeStream = fs.createWriteStream(filePath);

// 	await new Promise((resolve, reject) => {
// 		ytdl(url, { quality: "highest" })
// 			.pipe(writeStream)
// 			.on("finish", resolve)
// 			.on("error", reject);
// 	});

// 	return filePath;
// };

// const processVideo = async (filePath: string) => {
// 	const processedFilePath = `processed/${path.basename(filePath)}`;
// 	fs.renameSync(filePath, processedFilePath);
// 	return processedFilePath;
// };

// export async function POST(req: NextRequest) {
// 	const { url } = await req.json();

// 	try {
// 		const downloadedFilePath = await downloadVideo(url);
// 		const processedFilePath = await processVideo(downloadedFilePath);
// 		const fileBuffer = await readFileAsync(processedFilePath);

// 		return new NextResponse(fileBuffer, {
// 			headers: {
// 				"Content-Type": "video/mp4",
// 				"Content-Disposition": `attachment; filename=${path.basename(
// 					processedFilePath
// 				)}`,
// 			},
// 		});
// 	} catch (error) {
// 		return NextResponse.json(
// 			{ error: "Failed to download or process video" },
// 			{ status: 500 }
// 		);
// 	}
// }

import { NextRequest, NextResponse } from "next/server";
import ytdl from "ytdl-core";

export async function POST(req: NextRequest) {
	const { url } = await req.json();

	try {
		// Set headers for streaming response
		const headers = {
			"Content-Type": "video/mp4",
			"Content-Disposition": 'attachment; filename="video.mp4"',
		};

		// Fetch YouTube video info
		const info = await ytdl.getInfo(url);

		// Get readable stream for the video
		const videoStream = ytdl(url, { quality: "highest" });

		// Stream the video directly to the client
		return new NextResponse(videoStream as unknown as BodyInit, {
			headers,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to download or process video" },
			{ status: 500 }
		);
	}
}

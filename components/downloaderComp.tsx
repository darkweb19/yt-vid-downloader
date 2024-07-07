"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DownloadIcon from "./ui/DownloadIcon";

export default function DownloaderComp() {
	const [url, setUrl] = useState("");

	const [loading, setLoading] = useState(false);
	const [selectedFormat, setSelectedFormat] = useState("720p");
	const formats = [
		{ label: "720p", size: "28.2 MB", quality: "hd720" },
		{ label: "1080p", size: "50.4 MB", quality: "hd1080" },
		{ label: "1440p", size: "155.6 MB", quality: "hd1440" },
		{ label: "4K", size: "1.2 GB", quality: "hd2160" },
	];
	const getVideo = async (quality: string) => {
		setLoading(true);

		if (!url) {
			alert("Please enter a URL first!");
			return;
		}

		try {
			const response = await fetch("/api", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url, quality }),
			});

			const videoId = await fetch(`/api?link=${url}`, {
				cache: "no-store",
			});

			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.style.display = "none";
			a.href = downloadUrl;

			const { vidId } = await videoId.json();

			a.download = `Video-${vidId}`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(downloadUrl);
			setLoading(false);
		} catch (error) {
			console.error("Error downloading video:", error);
			alert(error);
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
			<div className="max-w-md w-full  p-5 space-y-6">
				<h1 className="text-3xl font-bold">YouTube Downloader</h1>
				<div className="flex items-center bg-[#1F1F1F]  rounded-md px-4 py-2">
					<input
						type="text"
						placeholder="Paste video URL"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						className="bg-background flex-1 p-3 rounded-sm outline-none"
					/>
					<Button
						variant="ghost"
						onClick={() => getVideo("hd1080")}
						className="text-white"
					>
						{loading ? "..." : <DownloadIcon className="w-5 h-5" />}
					</Button>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{formats.map((format, index) => (
						<Card
							key={index}
							className={`bg-[#1F1F1F] p-4 flex items-center justify-between ${
								selectedFormat === format.label
									? "border-2 border-primary"
									: "hover:bg-[#2A2A2A] transition-colors"
							}`}
							onClick={() => setSelectedFormat(format.label)}
						>
							<div>
								<div className="font-semibold">
									{format.label}
								</div>
								<div className="text-sm text-muted-foreground">
									{format.size}
								</div>
							</div>
							<Button
								variant="ghost"
								onClick={() => getVideo(format.quality)}
								className="text-white"
							>
								{loading ? (
									"..."
								) : (
									<DownloadIcon className="w-5 h-5" />
								)}
							</Button>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}

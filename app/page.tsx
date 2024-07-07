"use client";
import { useState } from "react";

export default function Home() {
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);

	const getVidoe = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		if (!url) {
			alert("Please enter a URL first!");
			return;
		}

		const response = await fetch("/api", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url }),
		});
		if (response.ok) {
			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.style.display = "none";
			a.href = downloadUrl;
			a.download = `YouTube-Video`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(downloadUrl);
			setLoading(false);
		} else {
			alert("Failed to download and process the video");
			setLoading(false);
		}
	};

	return (
		<main className="h-screen w-full">
			<div className="">
				<h1 className="text-4xl text-center mt-12 mb-5">
					Youtube Video Downloader
				</h1>
				<form
					className=" h-40 flex items-center justify-center gap-3"
					onSubmit={getVidoe}
				>
					<input
						type="text"
						className="text-black w-2/5 p-3 rounded-lg"
						placeholder="Enter YouTube URL"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
					/>
					<button className="p-3 border rounded-lg" type="submit">
						{" "}
						{loading ? "Loading..." : "Download"}{" "}
					</button>
				</form>
			</div>
		</main>
	);
}

//Browser extension that queries for all images on webpage load that do not have alt tags,
//and then sends them to a server for processing. The server then returns an alt tag for each image.
//The extension then adds the alt tag to the image.

// Listen for webpage load event
window.addEventListener("load", async () => {
	await generateAlt();
});

const generateAlt = async () => {
	// Query for all images that do not have alt tags
	let images = Array.from(document.getElementsByTagName("img")).filter(
		(img) => !img.alt
	);

	// Send these images to a server for processing
	images.forEach(async (img) => {
		let body = {};
		if (img.src.includes("data:image")) {
			body = { uri: img.src };
		} else if (img.src.includes("http")) {
			body = { url: img.src };
		} else {
			return;
		}

		try {
			const response = await fetch("http://147.182.138.175:3000/generateAlt", {
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			// Add the alt tag to the image
			img.alt = data?.altText;
		} catch (error) {
			console.error("Error:", error);
		}
	});
};

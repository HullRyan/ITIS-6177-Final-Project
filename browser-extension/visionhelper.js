//Browser extension that queries for all images on webpage load that do not have alt tags,
//and then sends them to a server for processing. The server then returns an alt tag for each image.
//The extension then adds the alt tag to the image.

// Listen for webpage load event
window.addEventListener("load", () => {
	generateAlt();
});

const generateAlt = () => {
	// Query for all images that do not have alt tags
	let images = Array.from(document.getElementsByTagName("img")).filter(
		(img) => !img.alt
	);

    console.log(images);

	// Send these images to a server for processing
	images.forEach((img) => {
		let body = {};
        console.log(img);
		if (img.src.includes("data:image")) {
			body = { uri: img.src };
		} else if (img.src.includes("http")) {
			body = { url: img.src };
		} else {
			return;
		}

        console.log(JSON.stringify(body));

		fetch("http://localhost:3000/generateAlt", {
            mode: "no-cors",
			method: "POST",
			body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Success:", data);
				// Add the alt tag to the image
				img.alt = data?.altText;
			})
			.catch((error) => console.error("Error:", error));
	});
};

//Validate if Url is valid
export const validateUrl = (req, res, next) => {
	const url = req.body?.url || null;
	if (!url) {
		return res.status(400).send("No url provided");
	}
	if (!url.startsWith("http") || url.includes(" ")) {
		return res.status(400).send("Url is not valid");
	}
	if (url.length > 1000) {
		return res.status(400).send("Url is too long");
	}
	req.parsedUrl = url;
	next();
};

//Validate if Uri is valid
export const validateUri = (req, res, next) => {
	const uri = req.body?.uri || null;
	if (!uri) {
		return res.status(400).send("No uri provided");
	}
	if (
		!uri.startsWith("data:image/jpeg;base64,") &&
		!uri.startsWith("data:image/jpg;base64,") &&
		!uri.startsWith("data:image/png;base64,")
	) {
		return res.status(400).send("Uri is not valid");
	}
	if (uri.length > 10000000) {
		return res.status(400).send("Uri is too long");
	}
	//From base64 to application/octet-stream
	const base64 = uri.split(",")[1];
	const buffer = Buffer.from(base64, "base64");
	req.parsedUri = buffer;
	next();
};

//Validate if request is URL or URI
export const validateImage = (req, res, next) => {
	const url = req.body?.url || null;
	const uri = req.body?.uri || null;
	if (!url && !uri) {
		return res.status(400).send("No url or uri provided");
	} else if (url && uri) {
		return res.status(400).send("Only one url or uri is allowed");
	} else if (url) {
		return validateUrl(req, res, next);
	} else if (uri) {
		return validateUri(req, res, next);
	} else {
		return res.status(400).send("Something went wrong");
	}
	next();
};

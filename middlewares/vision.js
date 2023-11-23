import dotenv from 'dotenv';
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js";

import { squishTextRegions } from "./helpers.js";

//Load environment variables from .env file
dotenv.config();

//Environment variables
const key1 = process.env.AZURE_KEY_1 || 'key not found';
const key2 = process.env.AZURE_KEY_2;
const endpoint = process.env.AZURE_ENDPOINT || 'endpoint not found';

//Authenticate client
const cognitiveServiceCredentials = new CognitiveServicesCredentials(key1);
const client = new ComputerVisionClient(cognitiveServiceCredentials, endpoint);

// Higher-order function to handle errors from Azure SDK
const handleErrors = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        next(error);
    }
};

// Middleware function to get image description from url
export const describeImageUrl = handleErrors(async (req, res, next) => {
    const description = await client.describeImage(req.parsedUrl);
    req.imageDescription = description;
    next();
});

// Middleware function to get image description from uri
export const describeImageUri = handleErrors(async (req, res, next) => {
    const description = await client.describeImageInStream(req.parsedUri);
    req.imageDescription = description;
    next();
});

// Middleware function to get text OCR from url
export const ocrImageUrl = handleErrors(async (req, res, next) => {
    const ocr = await client.recognizePrintedText(true, req.parsedUrl);
    ocr.recognizedText = {
        "language": ocr.language,
        "text": squishTextRegions(ocr.regions)
    };
    req.ocrResult = ocr;
    next();
});

// Middleware function to get text OCR from uri
export const ocrImageUri = handleErrors(async (req, res, next) => {
    const ocr = await client.recognizePrintedTextInStream(true, req.parsedUri);
    ocr.recognizedText = {
        "language": ocr.language,
        "text": squishTextRegions(ocr.regions)
    };
    req.ocrResult = ocr;
    next();
});

// Middleware function to get image alt text
export const generateAlt = handleErrors(async (req, res, next) => {
    console.log(req);
    if (req?.parsedUrl) {
        const altText = await client.describeImage(req.parsedUrl);
        const ocr = await client.recognizePrintedText(true, req.parsedUrl);
        req.altText = {
            "altText": altText?.captions?.[0]?.text || "",
            "ocrText": squishTextRegions(ocr.regions)
        };
    } else if (req?.parsedUri) {
        const altText = await client.describeImageInStream(req.parsedUri);
        const ocr = await client.recognizePrintedTextInStream(true, req.parsedUri);
        req.altText = {
            "altText": altText?.captions?.[0]?.text || "",
            "ocrText": squishTextRegions(ocr.regions)
        };
    }

    next();
});

const getAltText = async (url) => {
    const altText = await client.describeImage(url);
    return altText;
}

const getAltTextInStream = async (uri) => {
    const altText = await client.describeImageInStream(uri);
    return altText;
}

const getOcrText = async (url) => {
    const ocr = await client.recognizePrintedText(true, url);
    ocr.recognizedText = {
        "language": ocr.language,
        "text": squishTextRegions(ocr.regions)
    };
    return ocr;
}

const getOcrTextInStream = async (uri) => {
    const ocr = await client.recognizePrintedTextInStream(true, uri);
    ocr.recognizedText = {
        "language": ocr.language,
        "text": squishTextRegions(ocr.regions)
    };
    return ocr;
}
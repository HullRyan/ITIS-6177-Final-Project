import express from "express";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

//Import middlewares for vision api
import {
	describeImageUrl,
	describeImageUri,
	ocrImageUrl,
	ocrImageUri,
} from "./middlewares/vision.js";

//Import middlewares for Validation
import { validateUrl, validateUri } from "./middlewares/validation.js";

//Environment variables
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `localhost:${PORT}`;

//Swagger
const swaggerDefinition = {
	info: {
		title: "Vision API",
		version: "1.0.0",
		description: "Custom Vision API for Azure",
	},
	host: BASE_URL,
};

const options = {
	swaggerDefinition,
	apis: ["./app.js"],
	customCssUrl: "app.css",
};

const swaggerSpec = swaggerJSDoc(options);

//Server
const app = express();

//Middleware
// app.use(cors());
app.use(express.json({ limit: "10mb" })); //Image/request size limit

//Routes
app.use(
	"/docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, {
		customCss: ".scheme-container { display: none !important }",
	})
);

/**
 * @swagger
 * /describeUrl:
 *   post:
 *     description: Get description for image URL
 *     tags: [Image Description]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: url
 *         description: Image URL.
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               example: https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Red_Flower.png/800px-Red_Flower.png
 *     responses:
 *       200:
 *         description: Image description
 *       400:
 *         description: Invalid URL/Request
 *       500:
 *         description: Internal Server Error
 */
app.post("/describeUrl", validateUrl, describeImageUrl, async (req, res) => {
	res.send(req.imageDescription);
});

/**
 * @swagger
 * /describeUri:
 *   post:
 *     description: Get description for image URI
 *     tags: [Image Description]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: uri
 *         description: Image URI.
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             uri:
 *               type: string
 *               example: data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSgBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIADIAMgMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APQre2AHSrJLyQDHSgCC+ubKxC/bLmGAvwokcAt9B3pNpbjSb2Ki3VhcnEF1A7dMBxn8qFJPZg4tbkF1aA54qiTCvtPVgeKAMg6YMn5f0piPUIVFIo5n4o+JJ/C3hR7qyUNezSLBDnsxzzjvgA/jUydkOKuzj/DXgbxdroivr638md0/180o8wg/3uD/AEI7VyOfMzrULLUh1/4R+LngdLjXI5Is5WFkYhfoScip5+XoV7Pm2ZnfCnW7+y8SXXhfWbma5nXd5ZaQuqbRnAzzjFdVOfMrnJUhyux6jdRDmtTMzjFyeKAOshagZz3xH0n+2NAgXeI/s11HcFz/AAgEjPPHGc88cVnUdkaUleRVmtFlvYZ18bXcCIVDgXCrHCCcDcSMewz1rkutjucHuYet2kt/q9/JbeNrtoYJisTfaFKFcZwdmBkZo5ktLAqbfU828OX8GifESe9uJxdNtaMTkY3MSMn8uM100tjjrLW57qlxHdW6SxHKsMitjArnGTQM2YZeOtAC37h9PuFOCGQjHrxQB4tYalo1tY3emeKLadPM5juEQlXHYOAwyRgdfSuKUbSfKd0J2S5jkb6fSrOI2fhwNNI75aeSPaqD1ALHn3os27yFKS2gjlLIM9+u8nfv5/OupeRxy8z3zwbqDR2aQStlQOM1ZJ0vnigZ0WiaRqGoqrxw+XEf+Wknyj/E0m7D3OytvCdolswuZXnkIxxwoP071Ldx2PJvGPge6DyBLL7QgztMS7uPp1FcjhJM7Y1INWOK0zwFqE91hdOeFN3JZNoqbSZXNCOp6Dofwz0uCN21W0triR+ACoJX3z6/St6UJR3Zy1Zqexqy/DjTdudOnmtGHQE71/Xn9a35jDlKR8D6mCQL21IHQnP+FPmDlZ3NlrguNvklcdD7H0qCjVW7LLy1AFO4mBzvOR+dAGVLc26P92UH1EL/AM8UXAsrcRsmVZSPUGhO+wFO71NYSDvxzigDDbXWLE/aEGT03DikBheCZHYOWdiSUPJ7mNcmmgO9iZsJ8x5PrQBR0iR3s3Z3Zj50gyTn+I1U9zOk7x17s8U+KGo3qeJdUiS8uViQR7UErALx2GeKwe5sT/B3ULy41S9Se7uJU8sHa8jMM/QmnHcDsfFEjrENrsPnXofcVoSeKas7/wBq3vzN/rn7/wC0aQj/AP/Z
 *     responses:
 *       200:
 *         description: Image description
 *       400:
 *         description: Invalid URI/Request
 *       500:
 *         description: Internal Server Error
 */
app.post("/describeUri", validateUri, describeImageUri, async (req, res) => {
	res.send(req.imageDescription);
});

/**
 * @swagger
 * /ocrUrl:
 *   post:
 *     description: Get OCR for image URL
 *     tags: [OCR]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: url
 *         description: Image URL.
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               example: https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Red_Flower.png/800px-Red_Flower.png
 *     responses:
 *       200:
 *         description: OCR result
 *       400:
 *         description: Invalid URL/Request
 *       500:
 *         description: Internal Server Error
 */
app.post("/ocrUrl", validateUrl, ocrImageUrl, async (req, res) => {
	res.send(req.ocrResult);
});

/**
 * @swagger
 * /ocrUri:
 *   post:
 *     description: Get OCR for image URI
 *     tags: [OCR]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: uri
 *         description: Image URI.
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             uri:
 *               type: string
 *               example: data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSgBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIADIAMgMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APQre2AHSrJLyQDHSgCC+ubKxC/bLmGAvwokcAt9B3pNpbjSb2Ki3VhcnEF1A7dMBxn8qFJPZg4tbkF1aA54qiTCvtPVgeKAMg6YMn5f0piPUIVFIo5n4o+JJ/C3hR7qyUNezSLBDnsxzzjvgA/jUydkOKuzj/DXgbxdroivr638md0/180o8wg/3uD/AEI7VyOfMzrULLUh1/4R+LngdLjXI5Is5WFkYhfoScip5+XoV7Pm2ZnfCnW7+y8SXXhfWbma5nXd5ZaQuqbRnAzzjFdVOfMrnJUhyux6jdRDmtTMzjFyeKAOshagZz3xH0n+2NAgXeI/s11HcFz/AAgEjPPHGc88cVnUdkaUleRVmtFlvYZ18bXcCIVDgXCrHCCcDcSMewz1rkutjucHuYet2kt/q9/JbeNrtoYJisTfaFKFcZwdmBkZo5ktLAqbfU828OX8GifESe9uJxdNtaMTkY3MSMn8uM100tjjrLW57qlxHdW6SxHKsMitjArnGTQM2YZeOtAC37h9PuFOCGQjHrxQB4tYalo1tY3emeKLadPM5juEQlXHYOAwyRgdfSuKUbSfKd0J2S5jkb6fSrOI2fhwNNI75aeSPaqD1ALHn3os27yFKS2gjlLIM9+u8nfv5/OupeRxy8z3zwbqDR2aQStlQOM1ZJ0vnigZ0WiaRqGoqrxw+XEf+Wknyj/E0m7D3OytvCdolswuZXnkIxxwoP071Ldx2PJvGPge6DyBLL7QgztMS7uPp1FcjhJM7Y1INWOK0zwFqE91hdOeFN3JZNoqbSZXNCOp6Dofwz0uCN21W0triR+ACoJX3z6/St6UJR3Zy1Zqexqy/DjTdudOnmtGHQE71/Xn9a35jDlKR8D6mCQL21IHQnP+FPmDlZ3NlrguNvklcdD7H0qCjVW7LLy1AFO4mBzvOR+dAGVLc26P92UH1EL/AM8UXAsrcRsmVZSPUGhO+wFO71NYSDvxzigDDbXWLE/aEGT03DikBheCZHYOWdiSUPJ7mNcmmgO9iZsJ8x5PrQBR0iR3s3Z3Zj50gyTn+I1U9zOk7x17s8U+KGo3qeJdUiS8uViQR7UErALx2GeKwe5sT/B3ULy41S9Se7uJU8sHa8jMM/QmnHcDsfFEjrENrsPnXofcVoSeKas7/wBq3vzN/rn7/wC0aQj/AP/Z
 *     responses:
 *       200:
 *         description: OCR result
 *       400:
 *         description: Invalid URI/Request
 *       500:
 *         description: Internal Server Error
 */
app.post("/ocrUri", validateUri, ocrImageUri, async (req, res) => {
	res.send(req.ocrResult);
});

/**
 * @swagger
 * /textUrl:
 *   post:
 *     description: Get text from image URL
 *     tags: [Text Extraction]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: url
 *         description: Image URL.
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               example: https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Red_Flower.png/800px-Red_Flower.png
 *     responses:
 *       200:
 *         description: Extracted text
 *       400:
 *         description: Invalid URL/Request
 *       500:
 *         description: Internal Server Error
 */
app.post("/textUrl", validateUrl, ocrImageUrl, async (req, res) => {
	res.send(req.ocrResult.recognizedText);
});

/**
 * @swagger
 * /textUri:
 *   post:
 *     description: Get text from image URI
 *     tags: [Text Extraction]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: uri
 *         description: Image URI.
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             uri:
 *               type: string
 *               example: data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSgBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIADIAMgMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APQre2AHSrJLyQDHSgCC+ubKxC/bLmGAvwokcAt9B3pNpbjSb2Ki3VhcnEF1A7dMBxn8qFJPZg4tbkF1aA54qiTCvtPVgeKAMg6YMn5f0piPUIVFIo5n4o+JJ/C3hR7qyUNezSLBDnsxzzjvgA/jUydkOKuzj/DXgbxdroivr638md0/180o8wg/3uD/AEI7VyOfMzrULLUh1/4R+LngdLjXI5Is5WFkYhfoScip5+XoV7Pm2ZnfCnW7+y8SXXhfWbma5nXd5ZaQuqbRnAzzjFdVOfMrnJUhyux6jdRDmtTMzjFyeKAOshagZz3xH0n+2NAgXeI/s11HcFz/AAgEjPPHGc88cVnUdkaUleRVmtFlvYZ18bXcCIVDgXCrHCCcDcSMewz1rkutjucHuYet2kt/q9/JbeNrtoYJisTfaFKFcZwdmBkZo5ktLAqbfU828OX8GifESe9uJxdNtaMTkY3MSMn8uM100tjjrLW57qlxHdW6SxHKsMitjArnGTQM2YZeOtAC37h9PuFOCGQjHrxQB4tYalo1tY3emeKLadPM5juEQlXHYOAwyRgdfSuKUbSfKd0J2S5jkb6fSrOI2fhwNNI75aeSPaqD1ALHn3os27yFKS2gjlLIM9+u8nfv5/OupeRxy8z3zwbqDR2aQStlQOM1ZJ0vnigZ0WiaRqGoqrxw+XEf+Wknyj/E0m7D3OytvCdolswuZXnkIxxwoP071Ldx2PJvGPge6DyBLL7QgztMS7uPp1FcjhJM7Y1INWOK0zwFqE91hdOeFN3JZNoqbSZXNCOp6Dofwz0uCN21W0triR+ACoJX3z6/St6UJR3Zy1Zqexqy/DjTdudOnmtGHQE71/Xn9a35jDlKR8D6mCQL21IHQnP+FPmDlZ3NlrguNvklcdD7H0qCjVW7LLy1AFO4mBzvOR+dAGVLc26P92UH1EL/AM8UXAsrcRsmVZSPUGhO+wFO71NYSDvxzigDDbXWLE/aEGT03DikBheCZHYOWdiSUPJ7mNcmmgO9iZsJ8x5PrQBR0iR3s3Z3Zj50gyTn+I1U9zOk7x17s8U+KGo3qeJdUiS8uViQR7UErALx2GeKwe5sT/B3ULy41S9Se7uJU8sHa8jMM/QmnHcDsfFEjrENrsPnXofcVoSeKas7/wBq3vzN/rn7/wC0aQj/AP/Z
 *     responses:
 *       200:
 *         description: Extracted text
 *       400:
 *         description: Invalid URI/Request
 *       500:
 *         description: Internal Server Error
 */
app.post("/textUri", validateUri, ocrImageUri, async (req, res) => {
	res.send(req.ocrResult.recognizedText);
});

//Format response from thrown errors
app.use((err, req, res, next) => {
	res.status(err.statusCode || 500).send(err.message);
});

//Start server
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

# Azure Image Processing API

Author: Ryan Hull
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Azure Image Processing API](#azure-image-processing-api)
  - [Getting Started](#getting-started)
  - ["Vision Helper" Web Extension](#vision-helper-web-extension)
  - [API Documentation](#api-documentation)
  - [Installation/Self Hosting](#installationself-hosting)
  - [Endpoints](#endpoints)
    - [URL or URI](#url-or-uri)
      - [POST /generateAlt](#post-generatealt)
    - [URL](#url)
      - [POST /describeUrl](#post-describeurl)
      - [POST /ocrUrl](#post-ocrurl)
      - [POST /textUrl](#post-texturl)
    - [URI](#uri)
      - [POST /describeUri](#post-describeuri)
      - [POST /ocrUri](#post-ocruri)
      - [POST /textUri](#post-texturi)
  - [Error Handling](#error-handling)

<!-- /code_chunk_output -->

## Getting Started

To use this API, send a POST request to the desired endpoint with the required parameters in the request body. You can use any HTTP client, such as curl or Postman, to send requests to the API. For the easiest approach, you can use the [Swagger documentation page](http://147.182.138.175:3000/docs) to send requests to the API.

## "Vision Helper" Web Extension

An extra part of my project is a web extension that will scan through images on web pages searching for missing Alt attributes. If found, it will call the [generateAlt]() API endpoint and insert the generated Alt description and OCR onto the page.  

View the [web extension](https://github.com/HullRyan/ITIS-6177-Final-Project/tree/main/browser-extension) readme for more information and how to install it.

## API Documentation

For more detailed information about the API's endpoints and their parameters, see the [Swagger documentation page](http://147.182.138.175:3000/docs).

* **Note** that the API is rate limited to 10 sucessful requests per minute. If you hit this limit and see error responses, please wait a short bit and try again.

## Installation/Self Hosting

To run the API locally, you will need to have [Node.js](https://nodejs.org/en/) installed on your machine.  

Clone the repository to your local machine `git clone https://github.com/HullRyan/ITIS-6177-Final-Project`, then cd into the project directory, and run `npm install` to install the dependencies.

You will also need to have an Azure account with a Computer Vision resource created. You can create a free account [here](https://azure.microsoft.com/en-us/free/), then follow their [guides](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview) on setting up a resource and getting started to learn some in and outs.

Once you have a resource created, you will need to set the following environment variables in a `.env` file in the root directory of the project:

```bash
AZURE_KEY="Azure Computer Vision API Key"
AZURE_ENDPOINT="https://{Azure Resource Name}.cognitiveservices.azure.com/"
BASE_URL="47.182.138.175:3000" # Optional, Default is localhost:3000
PORT="Port to run the API on" # Optional, Default is 3000
```

Once you have the environment variables set, you can run the API with `npm start`.

You're running!  

To use your hosted API, send a POST request to the desired endpoint with the required parameters in the request body. For the easiest approach, you can use the Swagger Documentation page to send requests to the API, which will be hosted locally at your IP (if set) or Localhost:Port `/docs`.

## Endpoints

### URL or URI 

#### POST /generateAlt

Generate an Alt description for an image from a URL or URI. 

**Request body:**

```json
{
    "url": "http://example.com/image.jpg",
    "uri": "data:image/jpeg;base64,..."
}
```

* **Note** that you must provide either a URL or a URI, but not both.

**Example Response:**

```json
{
  "altText": "a yellow sign on a pole",
  "ocrText": "IMAGINE \nART \nHERE \n\n\n"
}
```

### URL

The following endpoints accept a URL to an image as a parameter.

**Request body:**

```json
{
    "url": "http://example.com/image.jpg"
}
```

#### POST /describeUrl

Get a description of an image from a URL.

**Response Body:**

```json
{
  "tags": [
    "flower",
    "plant",
    "purple",
    "pink",
    "close"
  ],
  "captions": [
    {
      "text": "a bee on a flower",
      "confidence": 0.6035793423652649
    }
  ],
  "requestId": "abe24433-2335-4e0e-b0d9-70df6841f938",
  "metadata": {
    "width": 800,
    "height": 541,
    "format": "Png"
  },
  "modelVersion": "2021-05-01"
}
```

#### POST /ocrUrl

Perform OCR on an image from a URL.

**Response Body:**

```json
{
  "language": "lang",
  "textAngle": 0,
  "orientation": "NotDetected",
  "regions": [],
  "modelVersion": "2021-04-01",
  "recognizedText": {
    "language": "unk",
    "text": "some text from the image"
  }
}
```

#### POST /textUrl

Get the text from an image from a URL.

**Response Body:**

```json
{
  "language": "en",
  "text": "all text from image"
}
```

### URI

The following endpoints accept a URI to an image as a parameter.

**Request body:**

```json
{
    "uri": "data:image/jpeg;base64,..."
}
```

#### POST /describeUri

Get a description of an image from a URI.

**Response Body:**

```json
{
  "tags": [
    "flower",
    "plant",
    "purple",
    "pink",
    "close"
  ],
  "captions": [
    {
      "text": "a bee on a flower",
      "confidence": 0.6035793423652649
    }
  ],
  "requestId": "abe24433-2335-4e0e-b0d9-70df6841f938",
  "metadata": {
    "width": 800,
    "height": 541,
    "format": "Png"
  },
  "modelVersion": "2021-05-01"
}
```

#### POST /ocrUri

Perform OCR on an image from a URL.

**Response Body:**

```json
{
  "language": "lang",
  "textAngle": 0,
  "orientation": "NotDetected",
  "regions": [],
  "modelVersion": "2021-04-01",
  "recognizedText": {
    "language": "unk",
    "text": "some text from the image"
  }
}
```

#### POST /textUri

Perform OCR on an image from a URI.

**Response Body:**

```json
{
  "language": "en",
  "text": "all text from image"
}
```

## Error Handling

If an error occurs, the API will return a response with a non-200 status code and a message describing the error.

**Example Response:**

```json
{
    "status": 400,
    "message": "No url provided"
}
```


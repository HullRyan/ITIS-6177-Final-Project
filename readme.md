# Azure Image Processing API

This API uses Azure's Computer Vision services to extract information from images. You can get a description of an image, perform OCR on an image, and more.

## Getting Started

To use this API, send a POST request to the desired endpoint with the required parameters in the request body. You can use any HTTP client, such as curl or Postman, to send requests to the API. For the easiest approach, you can use the [Swagger documentation page]() to send requests to the API.

## API Documentation

For more detailed information about the API's endpoints and their parameters, see the [Swagger documentation page]().

* Note that the API is rate limited to 10 sucessful requests per minute.

## Endpoints

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


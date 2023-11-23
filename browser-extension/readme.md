# Vision Helper Web Extension

Author: Ryan Hull

This is a web extension designed to enhance your browsing experience, by providing accurate image Alt attributes and text extraction automatically, readily available for a screen-reader.

This is an extra mini-project serving as a proof of concept consuming my [Azure Vision middleware API](https://github.com/HullRyan/ITIS-6177-Final-Project).

- [Vision Helper Web Extension](#vision-helper-web-extension)
  - [Features](#features)
  - [Demo](#demo)
  - [Usage](#usage)
  - [Development](#development)
  - [Installation](#installation)
    - [Option 1](#option-1)
    - [Option 2](#option-2)
    - [Option 3](#option-3)


## Features

- Automatically adds Alt attributes to images on the page that are missing.
- Extracts text from the images and appends to images missing Alt attributes.

## Demo

![Demo](./demo.gif)

## Usage

**Note**: This extension is not yet published to the Chrome or Firefox extension stores. To use it, you must install it manually. This was developed and tested on Firefox, but should work on other browsers.

1. Install the extension (see below).
2. Navigate to a page with images missing Alt attributes.
3. Done! The extension will automatically add Alt attributes to the images.

## Development

This extension is pre-configured to make the API calls to my Azure Vision middleware API. If you would like to use your own API, you can change the `"http://147.182.138.175:3000/generateAlt"` link in `visionhelper.js` to point to your own hosted [Azure API](https://github.com/HullRyan/ITIS-6177-Final-Project). You will also need to update the `manifest.json` permissions section to include the new URL in order to make callouts to it.

This extension is built using [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) and [webextension-polyfill](https://github.com/mozilla/webextension-polyfill).  

To build the extension, run `web-ext build` in the root directory. This will create a zip file in the `web-ext-artifacts` directory. This zip file can be uploaded to the Chrome or Firefox extension stores, or loaded manually into your browser.

To run the extension in development mode, run `web-ext run` in the root directory. This will open a new Firefox window with the extension installed. Any changes made to the code will be automatically reloaded in the browser.

## Installation

### Option 1

1. Download or clone this repository to your local machine.
2. Open the browser's extension page:
    - For Chrome, go to chrome://extensions/
    - For Firefox, go to about:addons
3. Enable Developer mode (for Chrome) or Debug Add-ons (for Firefox).
4. Click on "Load Unpacked" (for Chrome) or "Load Temporary Add-on" (for Firefox).
5. Navigate to the directory where you cloned the repository and select it.

### Option 2

1. Browse to web-ext-artifacts and download the latest zip file.
2. Open the browser's extension page:
    - For Chrome, go to chrome://extensions/
    - For Firefox, go to about:addons
3. Install the extension by dragging the zip file onto the page.

### Option 3

1. Download or clone this repository to your local machine.
2. Build the extension by running `web-ext build` in the root directory.
3. Install the output .zip using Option 2 above.

The extension should now be installed and ready to use!  

//Function to get text from OCR object
export const squishTextRegions = (regions) => {
    let text = "";
    for (const region of regions) {
        for (const line of region.lines) {
            for (const word of line.words) {
                text += word.text + " ";
            }
            text += "\n";
        }
        text += "\n\n";
    }
    return text;
}
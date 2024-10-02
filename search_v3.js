const puppeteer = require('puppeteer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');

// Directory to save recording
const outputDir = '/Users/vishald/Documents/DWL/PuppeterScreenRecording';
const outputFile = path.join(outputDir, 'screenrecording.mp4');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Define screen capture for macOS using 'avfoundation'
    const command = ffmpeg()
        .setFfmpegPath(ffmpegPath) // Use the ffmpeg static path
        .input('0:1') // For screen capture, avfoundation format, adjust this for the right screen (0:1 for main screen with sound)
        .inputFormat('avfoundation') // macOS screen capturing format
        .output(outputFile)
        .videoCodec('libx264')
        .format('mp4')
        .on('end', () => console.log(`Screen recording saved to: ${outputFile}`))
        .on('error', (err) => console.error(`Error: ${err.message}`));

    // Start the FFmpeg recording
    command.run();

    // Go to Google and perform a search for "Taj Mahal"
    await page.goto('https://www.google.com');
    await page.waitForSelector('textarea[name="q"]');
    await page.type('textarea[name="q"]', 'Taj Mahal');
    await page.keyboard.press('Enter');
    await page.waitForNavigation();

    // Stop the recording after 10 seconds
    setTimeout(async () => {
        command.kill('SIGINT'); // Stop recording
        await browser.close(); // Close the browser
    }, 10000);  // Record for 10 seconds
})();

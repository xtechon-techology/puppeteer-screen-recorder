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
    // Launch browser
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Start recording with FFmpeg
    const command = ffmpeg()
        .input('capture_screen')  // This part needs adjustment
        .inputFormat('avfoundation')
        .output(outputFile)
        .videoCodec('libx264')
        .format('mp4')
        .on('end', () => console.log(`Screen recording saved to: ${outputFile}`))
        .on('error', (err) => console.error(`Error: ${err.message}`));

    command.run();

    // Go to Google and perform the search
    await page.goto('https://www.google.com');
    await page.waitForSelector('textarea[name="q"]');
    await page.type('textarea[name="q"]', 'Taj Mahal');
    await page.keyboard.press('Enter');
    await page.waitForNavigation();

    // Stop recording
    setTimeout(async () => {
        command.kill('SIGINT');  // Stop the recording after some time
        await browser.close();
    }, 10000);  // Record for 10 seconds
})();

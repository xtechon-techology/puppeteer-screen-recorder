const puppeteer = require('puppeteer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

(async () => {
    // Define the output file for the screen recording
    const outputFile = path.join(__dirname, 'screenrecording.mp4');

    // Start the FFmpeg command
    const ffmpegCommand = ffmpeg()
        .input('3') // Capture screen device
        .inputFormat('avfoundation')
        .output(outputFile)
        .videoCodec('libx264')
        .format('mp4')
        .on('end', () => console.log(`Screen recording saved to: ${outputFile}`))
        .on('error', (err) => console.error(`Error: ${err.message}`));

    // Start recording the screen
    ffmpegCommand.run();

    // Launch Puppeteer
    const browser = await puppeteer.launch({
        headless: false, // Set to false to see the browser
        defaultViewport: null,
        args: ['--start-maximized'], // Start maximized for better capture
    });

    const page = await browser.newPage();

    // Navigate to Google
    await page.goto('https://www.google.com');

    // Find the search input field and type "Taj Mahal"
    const searchInputSelector = 'textarea[name="q"]';
    await page.waitForSelector(searchInputSelector);
    await page.type(searchInputSelector, 'Taj Mahal');
    await page.keyboard.press('Enter');

    // Wait for results to load using page.waitFor
    await page.waitFor(3000); // Adjust the timeout as needed

    // Close the browser
    await browser.close();

    // Stop the FFmpeg command after recording is complete
    ffmpegCommand.kill('SIGINT'); // Signal to stop the recording
})();

"use strict";

const puppeteer = require("puppeteer");
const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");

(async () => {
    const browser = await puppeteer.launch();
    try {
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 2,
        });

        const recorder = new PuppeteerScreenRecorder(page);
        await recorder.start("video.mp4");
        
        // Navigate to Google
        await page.goto('https://www.google.fr');

        await new Promise(resolve => setTimeout(resolve, 1000));
        

        // Find the search input field and type "Taj Mahal"
        const searchInputSelector = 'textarea[name="q"]';
        await page.waitForSelector(searchInputSelector);

        // Type 'Taj', then wait, and type 'Mahal'
        await page.type(searchInputSelector, 'Taj');
        // wait for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));

        await page.type(searchInputSelector, ' Mahal');


        // await page.type(searchInputSelector, 'Taj Mahal');
        await page.keyboard.press('Enter');

        // Wait for results to load
        await new Promise(resolve => setTimeout(resolve, 3000)); // Use setTimeout instead of waitForTimeout


        
        await animate(page);
        await recorder.stop();
    } catch (e) {
        console.log(e);
    } finally {
        await browser.close();
    }
})();

const animate = async (page) => {
    await wait(500);
    await page.evaluate(() => {
        window.scrollBy({ top: 500, left: 0, behavior: "smooth" });
    });
    await wait(500);
    await page.evaluate(() => {
        window.scrollBy({ top: 1000, left: 0, behavior: "smooth" });
    });
    await wait(1000);
};

const wait = (ms) => new Promise((res) => setTimeout(res, ms));
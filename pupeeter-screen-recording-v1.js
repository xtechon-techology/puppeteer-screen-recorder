import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();

const page = await browser.newPage();
await page.goto("https://screenshotone.com");


const recorder = await page.screencast({path: 'recording.webm'});

await recorder.stop();

browser.close();
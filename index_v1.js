const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser with French locale settings
  const browser = await puppeteer.launch({
    headless: false, // Show the browser window
    devtools: true,  // Enable devtools for recording
    args: ['--incognito','--lang=fr-FR'], // Set browser language to French
  });

  const page = await browser.newPage();

  // Clear cookies and cache before navigation
  const client = await page.target().createCDPSession();
  await client.send('Network.clearBrowserCache');
  await client.send('Storage.clearDataForOrigin', {
    origin: 'https://www.google.fr',
    storageTypes: 'all',
  });

  // Set permissions to allow geolocation
  const context = browser.defaultBrowserContext();
   
  await context.overridePermissions('https://www.google.fr', ['geolocation']);

  // Set geolocation to France (Paris)
  await page.setGeolocation({ latitude: 48.8566, longitude: 2.3522 });

  //-----------------------------------
  //await context.overridePermissions(server.PREFIX, ['geolocation']); 
  //await page.goto(server.EMPTY_PAGE); 
  await page.goto('https://www.google.fr');

  await page.setGeolocation({ latitude: 48.8566, longitude: 2.3522 });
    const geolocation = await page.evaluate( 
    () => 
      new Promise((resolve) => 
        navigator.geolocation.getCurrentPosition((position) => { 
          resolve({ 
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude, 
          }); 
        }) 
      ) 
  ); 

  //-----------------------------------
  
  
  // Navigate to Google France
  await page.goto('https://www.google.fr', { waitUntil: 'networkidle2' });

  // Ensure the page is fully loaded
  await page.waitForSelector('input[name="q"]');

  // Extract the content of the div with class 'uU7dJb' to verify the location
  const locationInfo = await page.evaluate(() => {
    return document.querySelector('div.uU7dJb').innerText;
  });

  console.log('Location Info:', locationInfo);  // Should print "France" if set correctly

  // Close the browser after a delay (optional)
  setTimeout(async () => {
    await browser.close();
  }, 5000);
})();

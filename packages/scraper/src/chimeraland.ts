// https://www.chimeraland.com/sea/news_detail.html?id=969b45bcaba3fa4b86ab8f8aa82aecbe4c64
import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.chimeraland.com/sea/news_detail.html?id=969b45bcaba3fa4b86ab8f8aa82aecbe4c64');

  const resultsSelector = '.news_container';

  await page.waitForSelector(resultsSelector);

  const contents = await page.evaluate((resultsSelector) => {
    return [...document.querySelectorAll(resultsSelector)].map((anchor) => {
      return anchor.innerHTML;
    });
  }, resultsSelector);

  console.log(contents);

  await browser.close();
})();

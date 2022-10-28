// https://www.chimeraland.com/sea/news_detail.html?id=969b45bcaba3fa4b86ab8f8aa82aecbe4c64
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as hpost from 'hexo-post-parser';
import puppeteer from 'puppeteer';
import slugify from 'slugify';
import { dirname, join } from 'upath';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.chimeraland.com/sea/news_list.html');

  const resultsSelector = '.news_link_item';

  const links = await page.evaluate((resultsSelector) => {
    return Array.from(document.querySelectorAll(resultsSelector)).map((anchor) => {
      return `https://www.chimeraland.com/sea/${anchor.getAttribute('href')?.replace('./', '')}`;
    });
  }, resultsSelector);

  // Print all the files.
  // console.log(links.join('\n'));
  links.concat(['']).map(getContent);

  await browser.close();
})();

async function getContent(url: string) {
  if (typeof url !== 'string' || String(url).trim().length === 0) return;

  const browser = await puppeteer.launch({ headless: true, timeout: 30 * 60 * 1000 });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'load', timeout: 0 });

  const resultsSelector = '.news_container';

  await page.waitForSelector(resultsSelector);

  const scrapper = await page.evaluate((resultsSelector: string) => {
    const content = Array.from(document.querySelectorAll(resultsSelector)).map((anchor) => {
      return anchor.innerHTML.trim();
    });
    const title = document.querySelector('.news_title')?.innerHTML.replace('——', ' - ').trim();
    const date = document.querySelector('.news_date')?.innerHTML.trim();
    return { content, title, date };
  }, resultsSelector);

  //console.log(scrapper.content.join('\n').trim(), scrapper.title);

  if (scrapper.title) {
    const metadata = {
      title: scrapper.title,
      date: String(scrapper.date)
    };

    const build = hpost.buildPost({ metadata, body: scrapper.content.join('\n').trim() });
    const postfilename =
      slugify(scrapper.title, {
        lower: true,
        trim: true,
        strict: true,
        replacement: '-'
      }) + '.md';
    const saveTo = join(__dirname, '../../../src-posts/scrapped', postfilename);
    if (!existsSync(saveTo)) {
      if (!existsSync(dirname(saveTo))) mkdirSync(dirname(saveTo));
      writeFileSync(saveTo, build);
      console.log(saveTo);
    }
  }

  await browser.close();
}

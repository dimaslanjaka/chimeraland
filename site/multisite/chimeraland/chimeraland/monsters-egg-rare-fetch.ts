import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { writeFileSync } from 'fs';
import jsdom from 'jsdom';
import moment from 'moment-timezone';
import { join } from 'path';
import { capitalize, jsonStringifyWithCircularRefs } from 'sbg-utility';
import monster from './monsters.json';

// same object, but with updated typings.
const axios = setupCache(Axios);

const fetch = axios.get(
  'https://zilliongamer.com/chimeraland/c/eggs-list/egg-rare-grade'
);

fetch.then((res) => {
  const dom = new jsdom.JSDOM(res.data);
  const document = dom.window.document;
  const mainC = document
    .querySelector('.main-content')
    .querySelector('.section-content');
  const tables = mainC.querySelectorAll('table').item(0).querySelector('tbody');
  const tabledatas = Array.from(tables.querySelectorAll('td'));
  for (let i = 0; i < tabledatas.length; i++) {
    const data = tabledatas[i];
    const name = data.textContent.trim();
    if (name.length > 0) {
      const url = new URL('https://zilliongamer.com');
      url.pathname = data.querySelector('img')?.src;
      let monsterIndex = monster.data.findIndex(
        (o) => o.name.toLowerCase() === name.toLowerCase()
      );

      if (monsterIndex === -1) {
        monsterIndex =
          monster.data.push({
            dateModified: moment(new Date()).format(),
            datePublished: moment(new Date()).format(),
            name: capitalize(name),
            qty: '',
            delicacies: [],
            buff: [],
            skill: [],
            images: [String(url)]
          } as (typeof monster.data)[number]) - 1;
      }

      // create images property
      if ('images' in monster.data[monsterIndex] === false) {
        monster.data[monsterIndex]['images'] = [];
      }
      // append image url
      if (!monster.data[monsterIndex]['images'].includes(String(url))) {
        monster.data[monsterIndex]['images'].push(String(url));
      }
      // append grade
      if (monster.data[monsterIndex].qty.length === 0) {
        monster.data[monsterIndex].qty = 'GRADE C ATK N/A HP N/A DEF N/A';
      }
    }
  }
  writeFileSync(
    join(__dirname, 'monsters.json'),
    jsonStringifyWithCircularRefs(monster)
  );
  dom.window.close();
});

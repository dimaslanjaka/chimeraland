import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import fs from 'fs-extra';
import jsdom from 'jsdom';
import moment from 'moment-timezone';
import { capitalize, jsonStringifyWithCircularRefs } from 'sbg-utility';
import path from 'upath';
import monster from './monsters.json';

// same object, but with updated typings.
const axios = setupCache(Axios);

const fetch = axios.get(
  'https://zilliongamer.com/chimeraland/c/eggs-list/egg-epic-grade'
);

fetch.then((res) => {
  const dom = new jsdom.JSDOM(res.data);
  const document = dom.window.document;
  const mainC = document
    .querySelector('.main-content')
    .querySelector('.section-content');
  const essenceList = Array.from(
    mainC.querySelectorAll('table').item(0).querySelectorAll('tbody tr td')
  )
    .map((el) => {
      const url = new URL(
        'https://zilliongamer.com' + el.querySelector('a')?.href
      );

      return {
        id_wrapper: url.hash.trim(),
        essence: el.textContent.trim()
      };
    })
    .filter((o) => o.essence.length > 0);

  for (let i = 0; i < essenceList.length; i++) {
    const item = essenceList[i];
    const header = document.querySelector(item.id_wrapper);
    const table = header.nextElementSibling;
    if (table.tagName === 'TABLE') {
      const datas = Array.from(table.querySelectorAll('tbody tr td'));
      for (let i = 0; i < datas.length; i++) {
        const data = datas[i];
        const name = data.textContent.trim();
        if (name.length > 0) {
          const url = new URL('https://zilliongamer.com');
          url.pathname = data.querySelector('img')?.src;
          let monsterIndex = monster.data.findIndex((o) => {
            const lowercaseName = name.toLowerCase();
            if (['newt', 'alligon'].includes(lowercaseName)) {
              return o.name.toLowerCase() === 'giant ' + lowercaseName;
            }
            return o.name.toLowerCase() === name.toLowerCase();
          });
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
            monster.data[monsterIndex].qty = 'GRADE B ATK N/A HP N/A DEF N/A';
          }
        }
      }
    } else {
      console.log(item, 'next sibling not an table');
    }
  }

  fs.writeFileSync(
    path.join(__dirname, 'monsters.json'),
    jsonStringifyWithCircularRefs(monster)
  );

  dom.window.close();
});

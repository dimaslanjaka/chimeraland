import ansiColors from 'ansi-colors'
import axios from 'axios'
import Bluebird from 'bluebird'
import { existsSync, mkdirSync, writeFile, writeFileSync as fsWrite } from 'fs'
import jsdom from 'jsdom'
import prettier from 'prettier'
import sharp from 'sharp'
import slugify from 'slugify'
import { basename, dirname, extname, join, toUnix } from 'upath'
import { Logger } from '../src/utils/debug'
import materialData from './materials.json'

const publicDir = join(__dirname, '../../public')
const save = false
const debug = Logger('chimera-evol-fetch')

const html = [
  `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>\n\n\n`
]
const url =
  'https://zilliongamer.com/chimeraland/c/guide/chimeraland-how-to-evolve-bony-sabretooth'

axios
  .get(url)
  .then(async ({ data }) => {
    const dom = new jsdom.JSDOM(data)
    const win = dom.window
    const doc = dom.window.document

    ;[
      'header.header',
      '.menu',
      '.postby',
      '.nav-menu',
      'script',
      'link',
      'meta',
      '.lastest_post',
      '.sidebar',
      '.footer',
      '#back-to-top',
      '.breadcrumb'
    ].forEach((selector) => {
      doc.querySelectorAll(selector).forEach((el) => el.remove())
    })

    const all = Array.from(doc.getElementsByTagName('*'))

    for (let i = 0, max = all.length; i < max; i++) {
      const el = all[i]
      el.removeAttribute('data-sheets-value')
      el.removeAttribute('data-sheets-userformat')
    }

    Array.from(doc.querySelectorAll('img')).forEach((el) => {
      if (!el) return
      const src = el.src
      if (src.startsWith('/')) el.src = 'https://zilliongamer.com' + src
    })

    const main = Array.from(doc.querySelectorAll('.main-content'))
    if (main.length > 0) {
      const contents = main[0]
      const inner =
        doc.querySelector('title')?.outerHTML + String(contents.innerHTML)
      doc.close()
      win.close()
      return inner
    }
    return ''
  })
  .then(async (contents) => {
    if (contents.length > 0) {
      const { window, document } = dom(contents)
      let thumbnail = ''
      const featured = document.querySelector('.detail__featured-image')
      if (featured) {
        const img = featured.querySelector('img')
        if (img) {
          const src = img.getAttribute('src')
          if (src) {
            thumbnail = src.trim()
          }
        }
      }
      let title = document.title
        .replace(/how to evolve/i, '')
        .replace(/- zilliongamer/i, '')
        .replace(/chimeraland/i, '')
        .trim()
      if (/^white snake$/i.test(title)) title = 'White Maiden'
      if (/evolve-noble-serpent/i.test(url)) title = 'Noble Serpent'
      if (/evolve-bony-sabretooth/i.test(url)) title = 'Bony Sabretooth'
      // get thumbnail
      if (/^https?:\/\//.test(thumbnail)) {
        const thumb = thumbnail
        await axios
          .get(thumb, { responseType: 'arraybuffer' })
          .then(async ({ data }) => {
            const dest_thumbnail = join(
              __dirname,
              'monsters',
              title.toLowerCase(),
              basename(thumb, extname(thumb)) + '.png'
            )
            // write thumbnail to monsters directory
            if (!existsSync(dest_thumbnail)) {
              write(dest_thumbnail, sharp(data).png())
            }
            thumbnail = dest_thumbnail
          })
      }

      const tables = Array.from(document.querySelectorAll('table'))

      // parse monster stats
      /*const table_stats = tables[1]

      if (table_stats)
        await Bluebird.all(table_stats.querySelectorAll('tbody td')).then(
          (el) => {
            const grade = 'A'
            const atk = el[0].textContent?.trim()
            const hp = el[1].textContent?.trim()
            const def = el[2].textContent?.trim()
            const qty = `GRADE ${grade} ATK ${atk} HP ${hp} DEF ${def}`
            const exMonster = monsterData.data.findIndex(
              (monster) =>
                slugify(monster.name, { lower: true, trim: true }) ===
                slugify(title, { lower: true, trim: true })
            )
            let isNewMonster = false
            if (exMonster == -1) {
              isNewMonster = true
              const newData = {
                name: title,
                qty,
                delicacies: [],
                skill: [],
                buff: []
              }
              monsterData.data.push(newData)
              write(
                join(__dirname, 'monsters.json'),
                JSON.stringify(monsterData, null, 2)
              )
            }
            html.push(
              `<h5>monsters.json (${
                isNewMonster
                  ? `<span class='text-success'>new</span>`
                  : `<span class='text-primary'>existing</span>`
              })</h5><pre><code>${JSON.stringify(
                monsterData.data[
                  monsterData.data.findIndex(
                    (monster) =>
                      slugify(monster.name, { lower: true, trim: true }) ===
                      slugify(title, { lower: true, trim: true })
                  )
                ],
                null,
                4
              )}</code></pre>`
            )
          }
        )
      */

      // parse evol material
      const materials: any[] = []
      const table_materials = tables[1]

      if (table_materials)
        await Bluebird.all(table_materials.querySelectorAll('td')).each(
          async (el) => {
            const src = el.querySelector('img')?.src
            const name = el.textContent
              ?.trim()
              .replace(/x\d{1,2}$/i, '')
              .trim()

            let materialInfo: any
            console.log({ name, src })
            if (typeof src === 'string' && typeof name === 'string') {
              const material_img_dest = join(
                __dirname,
                'materials',
                basename(src, extname(src)).replace(/-chimeraland/gi, '') +
                  '.png'
              )
              if (!existsSync(material_img_dest)) {
                await axios
                  .get(src, { responseType: 'arraybuffer' })
                  .then(({ data }) => {
                    write(material_img_dest, sharp(data).png())
                  })
              }

              const existingIndex = materialData.data.findIndex(
                (item) =>
                  slugify(item.name, { lower: true, trim: true }) ===
                  slugify(name, { lower: true, trim: true })
              )
              const details = `Used for Evolve ${title}`.replace(/\s+/gm, ' ')
              if (existingIndex != -1) {
                materialInfo = materialData.data[existingIndex]
                if ('images' in materialInfo === false) materialInfo.images = []
                if ('details' in materialInfo === false)
                  materialInfo.details = []
                materialInfo.images = (<string[]>materialInfo.images)
                  .concat([material_img_dest])
                  .filter(function (x, i, a) {
                    return a.indexOf(x) === i
                  })
                materialInfo.details = (<string[]>materialInfo.details)
                  .concat([details])
                  .filter(function (x, i, a) {
                    return a.indexOf(x) === i
                  })
                // assign new object
                materialData.data[existingIndex] = materialInfo
              } else {
                materialInfo = {
                  name,
                  images: [material_img_dest],
                  details: [details]
                }
                // push new object
                materialData.data.push(materialInfo)
              }
              materials.push({
                name,
                image: material_img_dest
              })
            }
          }
        )
      const list_detail_materials =
        table_materials.nextElementSibling?.querySelectorAll('li')
      if (typeof list_detail_materials !== 'undefined') {
        await Bluebird.all(list_detail_materials).each((el) => {
          let matchName = String(el.querySelector('strong')?.textContent).trim()

          if (/noble-golden-crow/i.test(url)) {
            // fix dragon pull to cray pill
            if (
              /dragon pill/i.test(
                String(el.querySelector('strong')?.textContent)
              )
            ) {
              matchName = 'Cray Pill'
            }
          }

          const howto = String(el.textContent).trim()
          const matIndex = materialData.data.findIndex(
            (mat) =>
              slugify(matchName, { lower: true, trim: true }) ===
              slugify(mat.name, { lower: true, trim: true })
          )

          if (matIndex != -1) {
            const existingIndex = materialData.data[matIndex]
            if ('howto' in existingIndex === false) existingIndex.howto = []
            existingIndex.howto = existingIndex.howto
              ?.concat([howto])
              .map((str) => str.replace(/\s+/gm, ' ').trim())
              .filter(function (x, i, a) {
                return a.indexOf(x) === i
              })
            materialData.data[matIndex] = existingIndex
          }
        })
      }

      materials.forEach((mat) => {
        const matIndex = materialData.data.findIndex(
          (material) => material.name === mat.name
        )
        html.push(
          `<h5>materials.json (<b>${
            mat.name
          }</b>)</h5><pre class='mb-2 border'><code>${JSON.stringify(
            materialData.data[matIndex],
            null,
            2
          )}</code></pre>`
        )
      })

      // push contents
      html.push(
        `<div class='mt-3 mb-3'>${document.documentElement.outerHTML}</div>`
      )

      document.close()
      window.close()

      writeFile(
        join(publicDir, 'axios-result.html'),
        prettier.format(`<div class='container'>${html.join('\n')}</div>`, {
          parser: 'html'
        }),
        () => null
      )
    }
  })

function dom(html: string) {
  const dom = new jsdom.JSDOM(html)
  return { jdom: dom, window: dom.window, document: dom.window.document }
}

function write(path: string, data: any, callback?: CallableFunction) {
  const isSharp = typeof data.toFile === 'function'
  debug(
    (
      (isSharp ? ansiColors.yellowBright('sharp ') : '') + 'attemp writing'
    ).trim(),
    path.replace(toUnix(process.cwd()), ''),
    save ? ansiColors.greenBright('true') : ansiColors.redBright('false')
  )
  if (!save) {
    if (typeof callback === 'function') callback()
    return // skip write file
  }
  if (!existsSync(dirname(path))) mkdirSync(dirname(path), { recursive: true })
  if (typeof data === 'function') {
    data = data()
  }
  if (isSharp) {
    // sharp
    console.log('sharp writing to', path)
    return data.toFile(path)
  }
  if (typeof data === 'object') data = JSON.stringify(data, null, 2)

  fsWrite(path, data)
}

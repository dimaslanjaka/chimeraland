import { readdirSync, readFileSync } from 'fs-extra'
import { spawnAsync } from 'git-command-helper'
import { buildPost, postMap, postMeta, renderMarkdown } from 'hexo-post-parser'
import { JSDOM } from 'jsdom'
import { EOL } from 'os'
import sbgutil from 'sbg-utility'
import slugify from 'slugify'
import { trueCasePathSync } from 'true-case-path'
import { basename, join, toUnix } from 'upath'
import { chimeralandProject } from '../../../project'

const metadata: postMeta = {
  title: 'Chimeraland Scammer List Player',
  description:
    'Blacklist player chimeraland (scammer list meliputi ruby trader, map illustrious 16 party, roll drop item, dan lain-lain). daftar SCAMMER chimeraland MAP ILLUSTRIOUS 16. daftar SCAMMER chimeraland ruby.',
  date: '2022-11-07T19:54:01+07:00',
  updated: '2023-04-18T00:00:28+07:00',
  lang: 'id',
  permalink: '/chimeraland/blacklist-player.html',
  multilang: {
    id: '/chimeraland/blacklist-player.html',
    en: '/chimeraland/en/blacklist-player.html'
  },
  tags: ['chimeraland', 'blacklist', 'guide'],
  categories: ['Games', 'Chimeraland'],
  keywords: ['scammer list chimeraland', 'blacklist player chimeraland'],
  thumbnail: 'https://rawcdn.githack.com/dimaslanjaka/source-posts/d8f65abfe4e6d85cc18fd71cb1658227582bec67/chimeraland/blacklist-player/thumbnail.png',
  author: 'L3n4r0x'
}
const translator = readFileSync(join(__dirname, 'translator.html')).toString()
const bodyfile = join(__dirname, 'body.md')
const bodymd = readFileSync(bodyfile).toString()
const bodyhtml = renderMarkdown(bodymd)
const dom = new JSDOM(bodyhtml)
Array.from(dom.window.document.querySelectorAll('table')).forEach(function (
  table
) {
  table.setAttribute('style', 'width:100%;')
  Array.from(table.querySelectorAll('tr')).forEach((tr) => {
    const player = tr.querySelector('td:nth-child(1)')
    if (player && !/nama player/gim.test(player.innerHTML)) {
      // console.log(player.innerHTML)
      // tell google translate do not translate this element
      // https://stackoverflow.com/a/9629628
      player.setAttribute('notranslate', 'true')
      player.setAttribute(
        'class',
        (player.getAttribute('class') || '').trim() + ' notranslate'
      )
      // add attribute id to player nickname
      const id = slugify(player.innerHTML)
      if (!dom.window.document.getElementById(id)) player.setAttribute('id', id)
    }
  })
})

Array.from(dom.window.document.querySelectorAll('*')).forEach(function (el) {
  let style = el.getAttribute('style') || ''
  if (!style.includes('vertical-align')) {
    if (!style.endsWith(';')) style += ';'
    style += 'vertical-align: unset;'
  }
})

// remove .header-ancor
Array.from(dom.window.document.querySelectorAll('a')).forEach((el) => {
  if (/anchor/gim.test(el.getAttribute('class') || '')) {
    el.removeAttribute('class')
  }
})

// include screenshots
const screenshots = function (): Promise<string[]> {
  return new Promise((resolve) => {
    const results: string[] = []
    const imagesDir = join(__dirname, 'images')
    readdirSync(imagesDir)
      .filter((path) => /.(jpe?g|png)$/i.test(path))
      .map((path) => join(imagesDir, path))
      .map((path, index, all) => {
        //https://stackoverflow.com/a/957978
        spawnAsync('git', 'rev-parse --show-toplevel'.split(' ')).then(
          (toplevel) => {
            // https://stackoverflow.com/a/4090938
            spawnAsync('git', 'config --get remote.origin.url'.split(' '), {
              cwd: __dirname
            })
              .then((origin) => {
                spawnAsync('git', 'branch --show-current'.split(' ')).then(
                  (branch) => {
                    const url = new URL(
                      origin.stdout.trim().replace(/(.git|\/)$/i, '')
                    )
                    url.pathname = (
                      url.pathname +
                      '/raw/' +
                      branch.stdout.trim() +
                      '/' +
                      toUnix(
                        trueCasePathSync(path).replace(
                          trueCasePathSync(toplevel.stdout.trim()),
                          ''
                        )
                      )
                    ).replace(/\/{2,}/gm, '/')

                    sbgutil.debug('chimera-blacklist')('img', url.toString())

                    const img = `<figure><img src="${url.toString()}" alt="${basename(path)}" /><figcaption>${basename(path)}</figcaption></figure>`
                    results.push(img)

                    if (index === all.length - 1) {
                      resolve(results.sort(Intl.Collator().compare))
                    }
                  }
                )
              })
              .catch(console.log)
          }
        )

        /*const jpgDataUrlPrefix =
          'data:image/' + extname(path).replace('.', '') + ';base64,'
        const base64 = readFileSync(path, 'base64')
        return `<figure><img src="${jpgDataUrlPrefix}${base64}" alt="${basename(
          path
        )}" /><figcaption>${basename(
          path
        )}</figcaption></figure>`*/
      })
  })
}
let body = dom.window.document.body.innerHTML
dom.window.close()
// console.log(body)

screenshots().then(function (ss) {
  body = body.replace('<!-- tangkapan.layar -->', ss.join(EOL))

  const post: postMap = {
    metadata,
    body: translator + '\n\n' + body,
    rawbody: translator + '\n\n' + body
  }
  const build = buildPost(post)
  const saveTo = join(chimeralandProject, 'src-posts/blacklist-player.md')

  sbgutil.debug('chimera-blacklist')(
    'blacklist saved',
    sbgutil.writefile(saveTo, build).file
  )
})

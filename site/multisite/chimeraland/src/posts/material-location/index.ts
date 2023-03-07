import fm from 'front-matter'
import fs from 'fs-extra'
import { postMap } from 'hexo-post-parser'
import { I18n } from 'i18n'
import nunjucks from 'nunjucks'
import { writefile } from 'sbg-utility'
import slugify from 'slugify'
import path from 'upath'
import { chimeralandProject } from '../../../project'
import { MaterialsData } from '../../utils/chimeraland'

interface pMap extends postMap {
  multilang?: Record<string, string>
}

const template = path.join(__dirname, 'template.md')
const postfm = fm<pMap>(fs.readFileSync(template).toString())

console.log(postfm)
const i18n = new I18n({
  // setup some locales - other locales default to en silently
  locales: ['en', 'de'],

  // fallback from Dutch to German and from any localized German (de-at, de-li etc.) to German
  fallbacks: { nl: 'de', 'de-*': 'de' },

  // you may alter a site wide default locale
  defaultLocale: 'en',

  // will return translation from defaultLocale in case current locale doesn't provide it
  retryInDefaultLocale: false,
  directory: path.join(__dirname, 'locales')
})

const data = MaterialsData.filter(
  (o) => Array.isArray(o.images) && o.images.length > 0
)
  .filter((o) => o.images.find((x) => x.pathname.includes('mount')))
  .map((o) => {
    // get only location
    const images = (
      o.images as {
        pathname: string
        absolute: string
      }[]
    ).filter((x) => x.pathname.includes('mount'))

    return Object.assign(o, { images })
  })

const env = nunjucks.configure(__dirname, { autoescape: false })

let content = ''

for (let i = 0; i < data.length; i++) {
  const item = data[i]
  content += `<a href="${item.pathname}" id="${slugify(item.name, {
    lower: true
  })}">${item.name}</a>`
  item.images.forEach((img) => {
    const alt = `${item.name} - ${path.basename(img.pathname, '.webp')}`
    content += `
<figure>
  <img
  src="${img.pathname}"
  alt="${alt}">
  <figcaption>${alt}</figcaption>
</figure>
    `
  })
  content += '\n\n'
}

const render = env.render(template, { content })
const dest = path.join(chimeralandProject, 'src-posts/material-location.md')
console.log('post written', writefile(dest, render).file)

import nunjucks from 'nunjucks'
import { writefile } from 'sbg-utility'
import slugify from 'slugify'
import path from 'upath'
import { chimeralandProject } from '../../../project'
import { MaterialsData } from '../../utils/chimeraland'

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

const render = env.render(path.join(__dirname, 'template.md'), { content })
const dest = path.join(chimeralandProject, 'src-posts/material-location.md')
console.log('post written', writefile(dest, render).file)

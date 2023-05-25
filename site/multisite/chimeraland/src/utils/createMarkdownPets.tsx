import { existsSync, mkdirpSync } from 'fs-extra'
import jsdom from 'jsdom'
import prettier from 'prettier'
import ReactDOMServer from 'react-dom/server'
import { writefile } from 'sbg-utility'
import slugify from 'slugify'
import { join } from 'upath'
import { inspect } from 'util'
import yaml from 'yaml'
import { hexoProject } from '../../project'
import { AttendantsData, MonstersData, RecipesData } from './chimeraland'
import { capitalizer } from './string'

interface Image {
  filename: string
  folder: string
  originalPath: string
  originalFilename: string
  pathname: string
  url?: string
}

type Images = Image[]

// create markdown for attendants and monsters
MonstersData.concat(AttendantsData as any).forEach((item) => {
  const publicDir = join(hexoProject, 'src-posts/chimeraland', item.type)

  const attr: Record<string, any> = {}
  attr.title = capitalizer(item.type).replace(/s$/, '') + ' ' + item.name
  attr.webtitle = 'chimeraland'
  attr.author = 'L3n4r0x'
  attr.updated = item.dateModified
  //attr.updated = moment().format()
  attr.date = item.datePublished
  attr.permalink = item.pathname
  attr.photos = (item.images as Images).map((image) => image.pathname)
  if (item.images.length > 0) {
    const featured = (item.images as Images).find((image) =>
      /feature/i.test(image.filename)
    )
    attr.thumbnail =
      (featured || (item.images as Images)[0])?.pathname ||
      'https://via.placeholder.com/550x50/FFFFFF/000000/?text=' + item.name
  }
  attr.tags = []
  attr.categories = []
  if (item.type === 'monsters') {
    attr.tags = ['chimeraland', 'monster', 'pet']
    attr.categories = ['Games', 'chimeraland', 'monsters']
  } else {
    attr.tags = ['chimeraland', 'Attendant']
    attr.categories = ['Games', 'chimeraland', 'attendants']
  }

  // remove undefineds
  item.delicacies = item.delicacies.filter(
    (str) => str.length > 0 && str !== 'undefined'
  )
  // add description when quality and delicacies written
  if (item.delicacies.length > 0 && item.qty.length > 0) {
    attr.description = `${item.type.replace(/s$/, '')} ${
      item.name
    } default quality ${item.qty} ${item.buff} delicacies/tasty ${
      item.delicacies
    } ${attr.categories} ${attr.tags}`.substring(0, 300)
  }

  // GRADE A ATK 75 HP 60 DEF 75
  const regex = /GRADE (\w{1}) ATK (\d{1,5}) HP (\d{1,5}) DEF (\d{1,5})/gim
  const qualities = [] as string[][]
  if (typeof item.qty === 'string') {
    if (item.qty.length > 0) {
      qualities.push(regex.exec(item.qty) || [])
    } else {
      qualities.push(['N/A', 'N/A', 'N/A', 'N/A'])
    }
  } else {
    const mapper = item.qty
      .map((str) => regex.exec(str))
      .filter((result) => Array.isArray(result))
    qualities.push(...mapper)
  }
  const qtyhtm = [] as JSX.Element[]

  for (let i = 0; i < qualities.length; i++) {
    const qty = qualities[i]
    qtyhtm.push(
      <div className="col-lg-4 mb-2">
        <table key={qty.join('')}>
          <tr>
            <th>GRADE</th>
            <td>
              {qty[1] === 'B'
                ? 'GRAND - EPIC'
                : qty[1] === 'C'
                ? 'RARE'
                : qty[1] === 'A'
                ? 'NOBLE - LEGENDARY'
                : qty[1] === 'A+'
                ? 'ILLUSTRIOUS - LEGENDARY'
                : qty[1] === 'S'
                ? 'DEOBEAST - MYTHIC 30,000 years'
                : qty[1] === 'S+'
                ? 'EXALTED DEOBEAST - MYTHIC 50,000 years'
                : qty[1]}
            </td>
          </tr>
          <tr>
            <th>Attack</th>
            <td>{qty[2]}</td>
          </tr>
          <tr>
            <th>Health Point (HP)</th>
            <td>{qty[3]}</td>
          </tr>
          <tr>
            <th>Defense</th>
            <td>{qty[4]}</td>
          </tr>
        </table>
      </div>
    )
  }

  let gallery: null | JSX.Element = null
  if (Array.isArray(item.images) && item.images.length > 0) {
    gallery = (
      <div id="gallery">
        <h2>Galleries for {item.name}</h2>
        <div className="row">
          {(item.images as Images).map((image) => {
            return (
              <div className="col-lg-6 col-12" key={image.originalPath}>
                <img
                  src={image.pathname}
                  alt={item.name + ' ' + image.filename}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const mdC = (
    <>
      <link
        rel="stylesheet"
        href="https://rawcdn.githack.com/dimaslanjaka/Web-Manajemen/870a349/css/bootstrap-5-3-0-alpha3-wrapper.css"
      />
      <section id="bootstrap-wrapper">
        <h2>{item.name} Information from Chimeraland</h2>
        <h2 id="attribute">
          <i>{item.name}</i> default maximum attribute
        </h2>
        <div className="row">
          {qtyhtm.reduce(
            (result, item) =>
              result.length > 0 ? [...result, ', ', item] : [item],
            []
          )}
        </div>
        <blockquote>
          Note: {item.name} stat will increase based on their <b>grade</b> and{' '}
          <b>delicacies/tasty</b>.
        </blockquote>
        <hr />
        <h2 id="delicacies">Delicacies/Tasty for {item.name}</h2>
        <div className="bg-dark text-light">
          {item.delicacies &&
            item.delicacies.map((recipeName, i) => {
              const recipe = RecipesData.find(
                (recipe) => recipe.name === recipeName
              )
              return (
                <li
                  key={recipeName + i}
                  className="d-flex justify-content-between bg-dark text-light">
                  {recipeName}{' '}
                  {recipe && (
                    <a
                      href={recipe.pathname}
                      className="text-primary"
                      title={
                        'Click here to view recipe ' + recipeName + ' details'
                      }>
                      <i>{recipeName}</i> details
                    </a>
                  )}
                </li>
              )
            })}
        </div>
        <hr />
        {gallery && gallery}
      </section>
    </>
  )
  let html = ReactDOMServer.renderToStaticMarkup(mdC).toString()

  try {
    html = prettier.format(html, { parser: 'html' })
  } catch (e) {
    if (e instanceof Error) {
      console.log('cannot prettify', item.name)
      if (!existsSync(join(process.cwd(), 'tmp'))) {
        mkdirpSync(join(process.cwd(), 'tmp'))
      }
      writefile(
        join(process.cwd(), 'tmp/prettier-error', item.name + '.log'),
        inspect(e)
      )
    }
  }

  const output = join(
    publicDir,
    slugify(item.name, { trim: true, lower: true }) + '.md'
  )

  // dump
  writefile(
    join(
      process.cwd(),
      'tmp/html',
      slugify(item.name, { trim: true, lower: true }) + '.html'
    ),
    '<!DOCTYPE html>' + new jsdom.JSDOM(html).serialize()
  )

  writefile(
    output,
    `
---
${yaml.stringify(attr).trim()}
---

${html}
  `.trim()
  )
})

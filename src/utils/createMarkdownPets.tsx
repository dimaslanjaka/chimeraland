import bluebird from 'bluebird'
import { existsSync, mkdirpSync } from 'fs-extra'
import jsdom from 'jsdom'
import prettier from 'prettier'
import ReactDOMServer from 'react-dom/server'
import { writefile } from 'sbg-utility'
import slugify from 'slugify'
import { join } from 'upath'
import { inspect } from 'util'
import yaml from 'yaml'
import { MonstersData, RecipesData } from './chimeraland'
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

/**
 * create markdown for attendants and monsters
 * @param hexoProject root of hexo project
 */
export function createMarkdownPets(hexoProject: string) {
  return bluebird.all(MonstersData).each(async (item) => {
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
      attr.categories = ['games', 'chimeraland', 'monsters']
    } else {
      attr.tags = ['chimeraland', 'Attendant']
      attr.categories = ['games', 'chimeraland', 'attendants']
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

    // GRADE A+ ATK 75 HP 60 DEF 75
    const regex =
      /GRADE (\w{1}|\w{1}\+) ATK (\d{1,5}) HP (\d{1,5}) DEF (\d{1,5})/
    const qualities = [] as string[][]
    if (typeof item.qty === 'string') {
      if (item.qty.length > 0) {
        qualities.push(regex.exec(item.qty) || [])
      } else {
        qualities.push(['N/A', 'N/A', 'N/A', 'N/A'])
      }
    } else {
      const mapper = item.qty
        .map((str) => {
          const exec = regex.exec(str.trim())
          if (!exec) {
            console.log('fail parse', str)
          }
          return exec
        })
        .filter((result) => Array.isArray(result)) as RegExpExecArray[]
      qualities.push(...mapper)
    }
    const qtyhtm = [] as JSX.Element[]

    for (let i = 0; i < qualities.length; i++) {
      const qty = qualities[i]
      qtyhtm.push(
        <div className="col mb-2" key={qty.join('')}>
          <div className="card">
            <div className="card-body">
              <table key={'table' + qty.join('')}>
                <tr>
                  <th>GRADE</th>
                  <td>
                    {qty[1]} <br />
                    {qty[1] === 'B' ? (
                      <span className="text-purple">GRAND - EPIC</span>
                    ) : qty[1] === 'C' ? (
                      <span className="text-primary">RARE</span>
                    ) : qty[1] === 'A' ? (
                      <span className="text-warning">NOBLE - LEGENDARY</span>
                    ) : qty[1] === 'A+' ? (
                      <span className="text-warning">
                        ILLUSTRIOUS - LEGENDARY
                      </span>
                    ) : qty[1] === 'S' ? (
                      <span className="text-danger">
                        DEOBEAST - MYTHIC 30,000 years
                      </span>
                    ) : qty[1] === 'S+' ? (
                      <span className="text-danger">
                        EXALTED DEOBEAST - MYTHIC 50,000 years
                      </span>
                    ) : (
                      qty[1]
                    )}
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
          </div>
        </div>
      )
    }

    let gallery: null | JSX.Element = null
    if (Array.isArray(item.images) && item.images.length > 0) {
      gallery = (
        <div id="gallery">
          <h2>Galleries for {item.name}</h2>
          <div className="row">
            {(item.images as Images).map((image, i) => {
              const url = new URL('https://www.webmanajemen.com')
              url.pathname = image.pathname
              return (
                <div className="col-lg-6 col-12" key={image.originalPath + i}>
                  <figure>
                    <img
                      src={String(url)}
                      alt={item.name + ' ' + image.filename}
                    />
                    <figcaption style={{ wordWrap: 'break-word' }}>
                      <i>{item.name}</i> {image.filename}.
                    </figcaption>
                  </figure>
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
          <div data-bs-theme="dark">
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
            <blockquote className="bd-callout bd-callout-warning">
              Note: {item.name} stat will increase based on their <b>grade</b>{' '}
              and <b>delicacies/tasty</b>.
            </blockquote>
            <hr />
            <h2 id="delicacies">Delicacies/Tasty for {item.name}</h2>
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Recipe Name</th>
                        <th>Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(item.delicacies) &&
                        item.delicacies.map((recipeName: string, i: number) => {
                          const existingRecipeData = RecipesData.find(
                            (recipe) => recipe.name === recipeName
                          )
                          const url = new URL('https://www.webmanajemen.com')
                          if (existingRecipeData) {
                            url.pathname = existingRecipeData.pathname
                          }
                          return (
                            <tr key={recipeName + i + item.name}>
                              <td>{recipeName}</td>
                              <td>
                                <a
                                  href={existingRecipeData ? String(url) : '#'}
                                  className="text-primary"
                                  title={
                                    'Click here to view recipe ' +
                                    recipeName +
                                    ' details'
                                  }>
                                  <i>{recipeName}</i> details
                                </a>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <hr />
            {gallery && gallery}
          </div>
        </section>
      </>
    )
    let html = ReactDOMServer.renderToStaticMarkup(mdC).toString()

    try {
      html = await prettier.format(html, { parser: 'html' })
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

    // dump
    writefile(
      join(
        process.cwd(),
        'tmp/html',
        item.type,
        slugify(item.name, { trim: true, lower: true }) + '.html'
      ),
      '<!DOCTYPE html>' + new jsdom.JSDOM(html).serialize()
    )

    /** markdown post */
    const md = `
---
${yaml.stringify(attr).trim()}
---

${html}
    `.trim()

    const arr = [
      /** hexo src-posts directory */
      join(hexoProject, 'src-posts/chimeraland', item.type),
      /** hexo source/_posts directory */
      join(hexoProject, 'source/_posts/chimeraland', item.type)
    ]
    arr.forEach((dir) => {
      const output = join(
        dir,
        slugify(item.name, { trim: true, lower: true }) + '.md'
      )
      writefile(output, md)
    })
  })
}

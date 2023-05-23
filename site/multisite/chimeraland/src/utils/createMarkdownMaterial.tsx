import Bluebird from 'bluebird'
import { existsSync, mkdirpSync, writeFileSync } from 'fs-extra'
import moment from 'moment'
import prettier from 'prettier'
import ReactDOMServer from 'react-dom/server'
import slugify from 'slugify'
import { dirname, join } from 'upath'
import { inspect } from 'util'
import yaml from 'yaml'
import { copyPost, hexoProject } from '../../project'
import { jsxJoin } from './array-jsx'
import { MaterialsData, RecipesData } from './chimeraland'
import { capitalizer, strIsSame } from './string'

const publicDir = join(hexoProject, 'src-posts/chimeraland/materials')

const errors: Error[] = []

Bluebird.all(MaterialsData)
  .each((item) => {
    const attr: Record<string, any> = {}
    attr.title = 'Material ' + item.name + ' Chimeraland'
    attr.date = item.datePublished
    attr.updated = item.dateModified
    //attr.updated = moment().format()
    attr.author = 'L3n4r0x'
    attr.permalink = item.pathname
    attr.photos = item.images.map(
      (image: { absolutePath: string; pathname: string }) => image.pathname
    )
    if (item.images.length > 0) {
      const featured = item.images.find((image) =>
        /feature/i.test(image.filename)
      )
      attr.thumbnail = (featured || item.images[0]).pathname
    }
    attr.tags = ['chimeraland', 'material']
    attr.categories = ['Games', 'chimeraland', 'material']

    let indexer = 0

    const recipes = findRecipe(item.name)

    const mdC = (
      <section id="bootstrap-wrapper">
        <link
          rel="stylesheet"
          href="https://rawcdn.githack.com/dimaslanjaka/Web-Manajemen/870a349/css/bootstrap-5-3-0-alpha3-wrapper.css"
        />
        <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm position-relative bg-light text-dark">
          <div className="col p-4 d-flex flex-column position-static">
            <strong className="d-inline-block mb-2 text-success">
              {item.type}
            </strong>
            <h2 className="mb-0">{item.name}</h2>
            <div className="mb-1 text-muted">
              {moment(item.dateModified).format('LLL')}
            </div>
            {'background-info' in item && (
              <div className="mb-2 border p-1">{item['background-info']}</div>
            )}
            <a href={attr.permalink} className="stretched-link d-none">
              Continue reading {item.name}
            </a>
          </div>
          <div className="col-auto d-none d-lg-block">
            <img
              src={
                item.images[0]
                  ? item.images[0].pathname
                  : 'https://via.placeholder.com/550x50/FFFFFF/000000/?text=' +
                    item.name
              }
              alt={item.name}
            />
          </div>
        </div>

        <div className="row bg-light text-dark">
          <div className="col-lg-6 col-12 mb-2">
            {'details' in item && (
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">
                    What is the use of the {item.name}
                  </h3>
                  <div className="card-text">
                    <ul>
                      {(item.details as string[]).map((str, i) => (
                        <li key={'details' + i}>{str}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-6 col-12 mb-2">
            {'howto' in item && (
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">How to get {item.name}</h3>
                  <div className="card-text">
                    <ul>
                      {(item.howto as string[]).map((str, i) => (
                        <li key={'details' + i}>{str}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/** print recipes only for cookable material */}
          {recipes && (
            <div className="col-12 mb-2">
              <h2 id="cookable">Cooking Recipes Using {item.name}</h2>
              {recipes}
            </div>
          )}

          <div className="col-12 mb-2">
            <h2>{item.name} Spawn Locations</h2>
            {item.images.length > 1 ? (
              (
                item.images as {
                  absolutePath: string
                  pathname: string
                }[]
              ).map((o, ii) => {
                indexer++
                if (!/mount/i.test(o.pathname)) {
                  return <div key={o.pathname + ii + indexer}></div>
                }

                const split = o.pathname.split(/\//g)
                const imgTitle = split[split.length - 1]
                  .substring(0, split[split.length - 1].lastIndexOf('.'))
                  .split(/-/g)
                  .map((str) => capitalizer(str))
                  .join(' ')
                return (
                  <div key={o.pathname + ii + indexer} className="p-4">
                    <h5>{imgTitle}</h5>
                    <img
                      src={o.pathname}
                      alt={item.name}
                      data-fancybox="true"
                      width="100%"
                    />
                  </div>
                )
              })
            ) : (
              <p>{item.name} is randomly spawned</p>
            )}
          </div>
        </div>
      </section>
    )

    const html = ReactDOMServer.renderToStaticMarkup(mdC).toString()

    const output = join(
      publicDir,
      slugify(item.name, { trim: true, lower: true }) + '.md'
    )
    if (/buckt/gi.test(item.name)) console.log(output)
    if (!existsSync(dirname(output))) mkdirpSync(dirname(output))
    writeFileSync(
      output,
      `
---
${yaml.stringify(attr).trim()}
---

${prettier.format(html, { parser: 'html' })}
  `.trim()
    )

    //console.log(output)
  })
  .then(() => {
    const errorfile = join(
      process.cwd(),
      'tmp/errors/chimeraland',
      'material.log'
    )
    mkdirpSync(dirname(errorfile))
    writeFileSync(errorfile, errors.map((e) => inspect(e)).join('\n\n'))

    copyPost()
  })

function findRecipe(matname: string) {
  const find = RecipesData.filter((item) =>
    item.recipes.some((str) => strIsSame(str, matname, false))
  )

  const map = find.map((item, i) => {
    const id = (prefix: string) =>
      slugify(prefix + item.name, {
        lower: true,
        trim: true,
        replacement: '-',
        strict: true
      })
    return (
      <div id={id('recipe-')} key={item.name + i + matname}>
        <h3 id={id('item-')}>{item.name}</h3>
        {item.recipes.map((recipe, ri) => {
          let device = 'Stove or Camp'
          if (/slushie|sauce|veggie paste|powder/gi.test(item.name)) {
            device = 'Mixer - Jam'
          }
          const rg = /--device: (.*)--/i
          const split = recipe.match(rg)
          if (split) {
            device = split[1]
          }
          const recipeMaterials = recipe
            .replace(rg, '')
            .trim()
            .split('+')
            // trim splitted string
            .map((str) => str.trim())
            // repeat count with clean string
            .map((str) => {
              const count = parseInt(str.match(/\[(\d)\]/)?.[1] || '0')
              const cleanstr = str.replace(/\[(\d)\]/, '').trim()
              if (count > 0) {
                const build: string[] = []
                for (let i = 0; i < count; i++) {
                  build.push(cleanstr)
                }
                return build
              }
              return [str]
            })
            // flat chunk
            .flat(1)
            // get internal links
            .map((str, mi) => {
              const replacement = str
                .trim()
                .split(/\/|\sor\s/gi)
                .map((str) => str.trim())
                .map((cleanstr) => {
                  if (cleanstr.includes('/')) console.log(cleanstr)
                  const findmat = MaterialsData.concat(RecipesData as any).find(
                    (mat) => {
                      const matName = slugify(mat.name, {
                        lower: true,
                        trim: true,
                        replacement: '-',
                        strict: true
                      })
                      const cstr = slugify(cleanstr, {
                        lower: true,
                        trim: true,
                        replacement: '-',
                        strict: true
                      })
                      /*
                      if (
                        [cleanstr, mat.name].every((str) => /buckt/gi.test(str))
                      ) {
                        console.log(matName, cstr, matName === cstr)
                      }
                      */
                      return matName === cstr
                    }
                  )
                  if (findmat) {
                    return (
                      <a
                        className="text-decoration-none"
                        href={findmat.pathname}
                        key={id('material' + ri + mi + '-')}>
                        {cleanstr}
                      </a>
                    )
                  } else {
                    errors.push(
                      new Error('cannot find material recipe ' + cleanstr)
                    )
                    return <>{cleanstr}</>
                  }
                })

              return jsxJoin(replacement, <span> / </span>)
            })
          //console.log(replace)
          return (
            <div className="mb-2" key={id('recipe-' + ri + '-')}>
              <table className="table">
                <tr>
                  <th>Recipe Name</th>
                  <td>
                    <b>{item.name}</b> {ri + 1}
                  </td>
                </tr>
                <tr>
                  <th>Material</th>
                  <td>{jsxJoin(recipeMaterials, <br />)}</td>
                </tr>
                <tr>
                  <th>Device</th>
                  <td>{device}</td>
                </tr>
              </table>
            </div>
          )
        })}
      </div>
    )
  })

  if (find) {
    return jsxJoin(map, <br />)
  }
  return null
}

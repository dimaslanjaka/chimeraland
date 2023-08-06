import Bluebird from 'bluebird'
import jsdom from 'jsdom'
import prettier from 'prettier'
import ReactDOMServer from 'react-dom/server'
import { writefile } from 'sbg-utility'
import slugify from 'slugify'
import { join } from 'upath'
import yaml from 'yaml'
import { MaterialsData, RecipesData } from './chimeraland'
import { strIsSame } from './string'

// const publicDir = join(hexoProject, 'src-posts/chimeraland/recipes')

export function createMarkdownRecipe(publicDir: string) {
  return Bluebird.all(RecipesData).each(async (item) => {
    const attr: Record<string, any> = {}
    attr.title = 'Recipe ' + item.name + ' Chimeraland'
    attr.author = 'L3n4r0x'
    attr.updated = item.dateModified
    //attr.updated = moment().format()
    attr.lang = 'en'
    attr.date = item.datePublished
    attr.permalink = item.pathname
    attr.photos = [
      item.images.pathname,
      item.images.name?.pathname,
      item.images.icon?.pathname,
      item.images.material?.pathname
    ]
    attr.thumbnail =
      item.images.pathname ||
      'https://via.placeholder.com/550x50/FFFFFF/000000/?text=' + item.name
    attr.tags = ['chimeraland', 'recipe']
    attr.categories = ['Games', 'chimeraland', 'recipes']

    const mdC = (
      <>
        <link
          rel="stylesheet"
          href="https://rawcdn.githack.com/dimaslanjaka/Web-Manajemen/870a349/css/bootstrap-5-3-0-alpha3-wrapper.css"
        />
        <section id="bootstrap-wrapper">
          <div data-bs-theme="dark">
            <div className="card mb-2">
              <div className="card-body">
                <div className="row g-0">
                  <div className="col-sm-4 position-relative mb-2">
                    <img
                      src={
                        item.images.material
                          ? new URL(
                              'https://www.webmanajemen.com' +
                                item.images.material.pathname
                            ).toString()
                          : 'https://via.placeholder.com/600'
                      }
                      className="card-img fit-cover w-100 h-100"
                      alt={item.name}
                      data-fancybox="true"
                    />
                  </div>
                  {/** buff */}
                  <div className="col-sm-8 mb-2">
                    <div className="card-body">
                      <div className="d-flex flex-row align-items-center mb-3">
                        {item.images && item.images.icon && (
                          <img
                            className="d-inline-block me-2"
                            src={new URL(
                              'https://www.webmanajemen.com' +
                                item.images.icon.pathname
                            ).toString()}
                            width="auto"
                            height="auto"
                            style={{ verticalAlign: 'middle' }}
                          />
                        )}
                        <h2 className="fs-5">{item.name} Cooking Recipe</h2>
                      </div>

                      <h2 className="card-title fs-5">Buff {item.name}</h2>

                      <div className="card-text">
                        <ul>
                          {'buff' in item ? (
                            (item.buff as string[])?.map((str, bi) => {
                              return <li key={'bi' + bi}>{str}</li>
                            })
                          ) : (
                            <>Buff {item.name} not yet written</>
                          )}
                        </ul>
                      </div>
                      <span className="badge rounded-pill">recipe</span>
                    </div>

                    <div className="card-footer text-end text-muted mt-auto">
                      webmanajemen.com - recipe {item.name}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer text-end text-muted">
                webmanajemen.com - recipe {item.name}
              </div>
            </div>

            {/** recipes */}
            <div className="row mb-2">
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
                    return str
                      .trim()
                      .split(/\/|\sor\s/gi)
                      .map((cleanstr) => {
                        if (cleanstr.includes('/')) console.log(cleanstr)
                        const findmat = MaterialsData.concat(
                          RecipesData as any
                        ).find((mat) => strIsSame(mat.name, cleanstr))
                        if (findmat) {
                          return (
                            <a
                              className="text-decoration-none text-primary"
                              href={findmat.pathname}
                              key={'material' + ri + mi}>
                              {cleanstr}
                            </a>
                          )
                        } else {
                          //console.log(cleanstr)
                          return <>{cleanstr}</>
                        }
                      })
                      .reduce((prev, curr) => (
                        <>
                          {prev}
                          <span> / </span>
                          {curr}
                        </>
                      ))
                  })
                  .reduce((prev, curr) => (
                    <>
                      {prev}
                      <span> + </span>
                      {curr}
                    </>
                  ))
                //console.log(replace)
                return (
                  <div
                    className="col-12 col-lg-6 recipe-item mb-2"
                    key={'recipe-' + ri}>
                    <div className="card">
                      <div className="card-body">
                        <h2 className="card-title fs-5">
                          Recipe {item.name} {ri + 1}
                        </h2>
                        <div className="card-text">
                          <ul>
                            <li>{recipeMaterials}</li>
                            {<li>Device: {device || 'Stove or Camp'}</li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </>
    )

    const html = ReactDOMServer.renderToStaticMarkup(mdC).toString()
    const formattedHtml = await prettier.format(html, { parser: 'html' })

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

    const output = join(
      publicDir,
      slugify(item.name, { trim: true, lower: true }) + '.md'
    )

    //if (/egg/i.test(item.name)) console.log(output)

    writefile(
      output,
      `
---
${yaml.stringify(attr).trim()}
---

  ${formattedHtml}
    `.trim()
    )
  })
}

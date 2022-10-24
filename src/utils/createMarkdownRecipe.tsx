import { existsSync, mkdirpSync, writeFileSync } from 'fs-extra'
import ReactDOMServer from 'react-dom/server'
import slugify from 'slugify'
import { dirname, join } from 'upath'
import yaml from 'yaml'
import { MaterialsData, RecipesData } from './chimeraland'
import { removeChimera } from './url'

const publicDir = join(__dirname, '../../source/_posts/auto-generated/recipes')

RecipesData.forEach((item) => {
  const attr: Record<string, any> = {}
  attr.title = item.name
  attr.webtitle = 'Chimeraland'
  attr.author = 'L3n4r0x'
  attr.updated = item.dateModified
  attr.date = item.datePublished
  attr.permalink = removeChimera(item.pathname)
  attr.photos = [
    removeChimera(item.images.name?.pathname),
    removeChimera(item.images.icon?.pathname),
    removeChimera(item.images.material?.pathname)
  ]
  attr.thumbnail =
    removeChimera(item.images.icon?.pathname) ||
    'https://via.placeholder.com/550x50/FFFFFF/000000/?text=' + item.name
  attr.tags = ['Recipe', 'Buff', 'Food']
  attr.categories = ['Games', 'Chimeraland', 'Recipes']

  const mdC = (
    <section id="bootstrap-wrapper">
      <link
        rel="stylesheet"
        href="https://cdn.statically.io/gh/dimaslanjaka/Web-Manajemen/40ac3225/css/bootstrap-4.5-wrapper.css"
      />

      <div className="row mb-2">
        <div className="col-md-12 mb-2">
          <table className="table" id="post-info">
            <tbody>
              <tr>
                <td>
                  {item.images && item.images.icon && (
                    <img
                      className="d-inline-block me-2"
                      src={item.images.icon.pathname}
                      width="auto"
                      height="auto"
                    />
                  )}
                </td>
                <td>
                  <h1 className="fs-5">{item.name} Cooking Recipe</h1>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mb-2">
        <div className="row g-0">
          <div className="col-sm-4 position-relative mb-2">
            <img
              src={
                item.images.material
                  ? item.images.material.pathname
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
              <span className="badge rounded-pill bg-dark">recipe</span>
            </div>

            <div className="card-footer text-end text-muted">
              webmanajemen.com
            </div>
          </div>
        </div>
      </div>

      {/** recipes */}
      <div className="row mb-2">
        {item.recipes.map((recipe, ri) => {
          let device = ''
          const rg = /--device: (.*)--/i
          const split = recipe.match(rg)
          if (split) {
            device = split[1]
          }
          const replace = recipe
            .replace(rg, '')
            .trim()
            .split('+')
            .map((str) => str.trim())
            .map((str, mi) => {
              const cleanstr = str.replace(/\[\d\]/, '').trim()
              const findmat = MaterialsData.find(
                (mat) =>
                  slugify(mat.name, { lower: true, trim: true }) ===
                  slugify(cleanstr, { lower: true, trim: true })
              )
              if (findmat) {
                return (
                  <a
                    className="text-decoration-none"
                    href={findmat.pathname}
                    key={'material' + ri + mi}>
                    {str}
                  </a>
                )
              } else {
                //console.log(cleanstr)
                return <>{str}</>
              }
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
                      <li>{replace}</li>
                      {device && <li>Device: {device}</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )

  const html = ReactDOMServer.renderToStaticMarkup(mdC).toString()

  const output = join(
    publicDir,
    slugify(item.name, { trim: true, lower: true }) + '.md'
  )
  if (!existsSync(dirname(output))) mkdirpSync(dirname(output))
  writeFileSync(
    output,
    `
---
${yaml.stringify(attr).trim()}
---

${html}
  `.trim()
  )
})

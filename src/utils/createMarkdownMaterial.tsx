import { existsSync, mkdirpSync, writeFileSync } from 'fs-extra'
import moment from 'moment'
import ReactDOMServer from 'react-dom/server'
import slugify from 'slugify'
import { dirname, join } from 'upath'
import yaml from 'yaml'
import { MaterialsData } from './chimeraland'
import { capitalizer } from './string'
import { removeChimera } from './url'

const publicDir = join(
  __dirname,
  '../../source/_posts/auto-generated/materials'
)

MaterialsData.forEach((item) => {
  const attr: Record<string, any> = {}
  attr.title = item.name
  attr.webtitle = 'Chimeraland'
  attr.updated = item.dateModified
  attr.date = item.datePublished
  attr.author = 'L3n4r0x'
  attr.permalink = removeChimera(item.pathname)
  attr.photos = item.images.map(
    (image: { absolutePath: string; pathname: string }) =>
      removeChimera(image.pathname)
  )
  if (item.images.length > 0) {
    const featured = item.images.find((image) =>
      /feature/i.test(image.filename)
    )
    attr.thumbnail = removeChimera((featured || item.images[0]).pathname)
  }
  attr.tags = ['Material']
  attr.categories = ['Games', 'Chimeraland', 'Materials']

  let indexer = 0

  const mdC = (
    <section id="bootstrap-wrapper">
      <link
        rel="stylesheet"
        href="https://cdn.statically.io/gh/dimaslanjaka/Web-Manajemen/40ac3225/css/bootstrap-4.5-wrapper.css"
      />
      <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm position-relative">
        <div className="col p-4 d-flex flex-column position-static">
          <strong className="d-inline-block mb-2 text-success">
            {item.type}
          </strong>
          <h3 className="mb-0">{item.name}</h3>
          <div className="mb-1 text-muted">
            {moment(item.dateModified).format('LLL')}
          </div>
          {'background-info' in item && (
            <div className="mb-2 border p-1">{item['background-info']}</div>
          )}
          <a href="#" className="stretched-link d-none">
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

      <div className="row">
        <div className="col-lg-6 col-12 mb-2">
          {'details' in item && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  What is the use of the {item.name}
                </h5>
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
                <h5 className="card-title">How to get {item.name}</h5>
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

        <div className="col-12 mb-2">
          <h5>{item.name} Spawn Locations</h5>
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

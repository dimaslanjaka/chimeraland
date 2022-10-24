import { existsSync, mkdirpSync, writeFileSync } from 'fs-extra'
import ReactDOMServer from 'react-dom/server'
import slugify from 'slugify'
import { dirname, join } from 'upath'
import yaml from 'yaml'
import { ScenicData } from './chimeraland'
import { capitalizer } from './string'

const publicDir = join(
  __dirname,
  '../../source/_posts/auto-generated/scenic-spot'
)

const siteMetadata = {
  title: 'Scenic Spot Locations',
  webtitel: 'Chimeraland',
  permalink: '/scenic-spots/',
  tags: ['Scenic-Spot'],
  categories: ['Games', 'Chimeraland', 'Scenic-Spot'],
  //datePublished: props.datePublished,
  //dateModified: props.dateModified,
  description: 'Scenic Spot Locations - Chimeraland',
  language: 'en-US,id',
  image: 'https://i.ytimg.com/vi/vk8Nz2AiKe8/maxresdefault.jpg',
  author: {
    email: 'dimaslanjaka@gmail.com',
    name: 'Dimas Lanjaka',
    image: 'https://avatars.githubusercontent.com/u/12471057?v=4'
  }
}
const gallery = ScenicData.map((item) => {
  if (item.pathname)
    return (
      <figure className="figure gal-item" key={item.name}>
        <img
          src={item.pathname}
          className="figure-img img-fluid rounded"
          alt={'Scenic Spot Stage 2 in ' + item.name}
          data-fancybox="true"
        />
        <figcaption className="figure-caption">
          Chimeraland Outer Space Scenic Spot in {item.name}
        </figcaption>
      </figure>
    )
}).filter((item) => typeof item !== 'undefined')

const mdC = (
  <section id="bootstrap-wrapper">
    <link
      rel="stylesheet"
      href="https://cdn.statically.io/gh/dimaslanjaka/Web-Manajemen/40ac3225/css/bootstrap-4.5-wrapper.css"
    />
    <div className="row">
      <div className="col-12 mb-2">
        <p>
          Scenic Spot in chimeraland is point view{' '}
          <b>World Info Achievements</b>
        </p>
        <p>
          Chimeraland has an incredible variety of landscapes and environments,
          from fiery volcanoes to snow-capped peaks and even outer space!
        </p>
        <p>
          Steam also has World Info Achievements (Total achievements: 33){' '}
          <a
            href="https://steamcommunity.com/stats/1913730/achievements"
            rel="nofollow noopener noreferer noreferrer"
            target="_blank">
            View Details Here
          </a>
        </p>
      </div>
    </div>

    <div className="row">
      <div className="col-12 col-lg-6 mb-2">{scenicTable('westmount')}</div>
      <div className="col-12 col-lg-6 mb-2">{scenicTable('eastmount')}</div>
      <div className="col-12 col-lg-6 mb-2">{scenicTable('southmount')}</div>
      <div className="col-12 col-lg-6 mb-2">{scenicTable('central')}</div>
    </div>

    <div className="row">
      {gallery.map((jsx, i) => {
        return (
          <div className="col-12 col-lg-6 mb-2" key={'jsx' + i}>
            {jsx}
          </div>
        )
      })}
    </div>

    <div className="row">
      <div className="col-12 mb-2">
        <h5>Chimeraland Scenery and Space Scenic Spots video</h5>
        <div className="ratio ratio-16x9">
          <iframe
            src="https://www.youtube.com/embed/dW-_pZDzs-w?rel=0"
            title="YouTube video"
            allowFullScreen={true}></iframe>
        </div>
      </div>
    </div>
  </section>
)

const html = ReactDOMServer.renderToStaticMarkup(mdC).toString()

const output = join(
  publicDir,
  slugify('scenic-index', { trim: true, lower: true }) + '.md'
)
if (!existsSync(dirname(output))) mkdirpSync(dirname(output))
writeFileSync(
  output,
  `
---
${yaml.stringify(siteMetadata).trim()}
---

${html}
  `.trim()
)

function scenicTable(faction: string) {
  return (
    <>
      <h5>Scenic Spot Locations In {capitalizer(faction)}</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Scenic Name</th>
            <th>Region</th>
          </tr>
        </thead>
        <tbody>
          {ScenicData.filter(
            (item) =>
              'starName' in item && new RegExp(faction, 'i').test(item.faction)
          ).map((item, i) => {
            const idStarName = slugify(item.starName, {
              lower: true,
              trim: true
            })
            const idRegion = slugify(item.region, { lower: true, trim: true })
            return (
              <tr key={item.starName + i}>
                <td id={idStarName}>{item.starName}</td>
                <td id={idRegion}>{item.region}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

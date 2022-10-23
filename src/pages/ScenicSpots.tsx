import { Helmet } from 'react-helmet'
import slugify from 'slugify'
import { adsArticle, adsArticle1, adsAuto } from '../components/adsense/myads'
import { OutboundLink } from '../components/react-seo-meta-tags/OutboundLink'
import { ReactSEOMetaTags } from '../components/react-seo-meta-tags/ReactSEOMetaTags'
import { ScenicData } from '../utils/chimeraland'
import { capitalizer } from '../utils/string'
import { pathname2url } from '../utils/url'
import './ScenicSpots.scss'

export function ScenicSpots() {
  const siteMetadata = {
    url: pathname2url('/chimeraland/scenic-spots'),
    title: 'Scenic Spot Locations - Chimeraland',
    //datePublished: props.datePublished,
    //dateModified: props.dateModified,
    description: 'Scenic Spot Locations - Chimeraland',
    language: 'en-US,id',
    image: 'https://i.ytimg.com/vi/vk8Nz2AiKe8/maxresdefault.jpg',
    author: {
      email: 'dimaslanjaka@gmail.com',
      name: 'Dimas Lanjaka',
      image: 'https://avatars.githubusercontent.com/u/12471057?v=4'
    },
    site: {
      siteName: 'WMI Chimeraland',
      searchUrl: 'https://www.google.com/search?q='
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

  gallery.splice(2, 0, adsArticle('Scenic-2'))

  gallery.splice(8, 0, adsArticle1('Scenic-8'))

  gallery.splice(14, 0, adsAuto('Scenic-14'))

  return (
    <>
      <ReactSEOMetaTags
        render={(el: React.ReactNode) => <Helmet>{el}</Helmet>}
        website={{ ...siteMetadata }}
      />
      <div className="container">
        <div className="row">
          <div className="col-12 mb-2">
            <p>
              Scenic Spot in chimeraland is point view{' '}
              <b>World Info Achievements</b>
            </p>
            <p>
              Chimeraland has an incredible variety of landscapes and
              environments, from fiery volcanoes to snow-capped peaks and even
              outer space!
            </p>
            <p>
              Steam also has World Info Achievements (Total achievements: 33){' '}
              <OutboundLink
                href="https://steamcommunity.com/stats/1913730/achievements"
                rel="nofollow noopener noreferer"
                target="_blank">
                View Details Here
              </OutboundLink>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-6 mb-2">{scenicTable('westmount')}</div>
          <div className="col-12 col-lg-6 mb-2">{scenicTable('eastmount')}</div>
          <div className="col-12 col-lg-6 mb-2">
            {scenicTable('southmount')}
          </div>
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
      </div>
    </>
  )
}

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

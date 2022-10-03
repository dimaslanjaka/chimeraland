import { useEffect } from 'react'
import { Fancybox } from '../fancybox/src'
import { ScenicData } from '../utils/chimeraland'
import { Adsense } from './adsense/Adsense'
import './ScenicSpots.scss'

export function ScenicSpots() {
  const delegate = '[data-fancybox]'

  useEffect(() => {
    const opts = {
      groupAll: true, // Group all items
      on: {
        ready: (fancybox: HTMLElement) => {
          console.log(`fancybox #${fancybox.id} is ready!`)
        }
      }
    }

    Fancybox.bind(delegate, opts)

    return () => {
      Fancybox.destroy()
    }
  }, [])

  const gallery = ScenicData.map((item) => {
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
  })

  gallery.splice(
    2,
    0,
    <Adsense
      style={{ display: 'block', textAlign: 'center' }}
      className="gal-item"
      layout="in-article"
      format="fluid"
      client="ca-pub-2188063137129806"
      slot="5634823028"
    />
  )

  gallery.splice(
    8,
    0,
    <Adsense
      style={{ display: 'block', textAlign: 'center' }}
      className="gal-item"
      layout="in-article"
      format="fluid"
      client="ca-pub-2188063137129806"
      slot="8481296455"
    />
  )

  gallery.splice(
    14,
    0,
    <Adsense
      style={{ display: 'block', textAlign: 'center' }}
      client="ca-pub-2188063137129806"
      slot="2667720583"
      format="auto"
      data-full-width-responsive="true"
    />
  )

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <p>
            Scenic Spot in chimeraland is point view{' '}
            <b>World Info Achievements</b>
          </p>
          <p>
            Chimeraland has an incredible variety of landscapes and
            environments, from fiery volcanoes to snow-capped peaks and even
            outer space!
          </p>
        </div>
        {gallery.map((jsx, i) => {
          return (
            <div className="col-12 col-lg-6 mb-2" key={'jsx' + i}>
              {jsx}
            </div>
          )
        })}
      </div>
    </div>
  )
}

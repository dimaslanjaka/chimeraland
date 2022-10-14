import axios from 'axios'
import { useEffect, useState } from 'react'
import { array_unique } from '../utils/array'
import { noop } from '../utils/noop'
import { capitalizer } from '../utils/string'
import { isValidHttpUrl } from '../utils/url'
import { OutboundLinkpropTypes } from './react-seo-meta-tags/OutboundLink'

export function Sitemap() {
  const [value, setValues] = useState(Array.from(SCache.links))
  const [hrefs, setHrefs] = useState<
    {
      category: string
      href: string
    }[]
  >([])
  const [keys, setKeys] = useState<string[]>([])

  useEffect(() => {
    const siteMapUrl = 'https://www.webmanajemen.com/chimeraland/sitemap.txt'
    axios
      .get('https://api.codetabs.com/v1/proxy/?quest=' + siteMapUrl)
      //.get('/proxy/?quest=' + siteMapUrl)
      .then((response) => {
        setValues((current) =>
          array_unique(current.concat(response.data.split(/\r?\n/))).filter(
            (str) => typeof str === 'string' && str.length > 0
          )
        )
      })
      .catch(noop)
  }, [])

  useEffect(() => {
    setHrefs((current) => {
      return array_unique(
        value
          .map((href) => {
            let category = ''
            if (!isValidHttpUrl(href)) {
              const sp = href.split(/\//)[1]
              category = capitalizer(sp && sp.length > 0 ? sp : 'Site')
            } else {
              category = 'Site'
              href = new URL(href).pathname
            }
            href = href.replace(/\/chimeraland\/?/, '/')
            return {
              category,
              href
            }
          })
          .filter((o) => o.category.length > 3)
          .concat(current),
        'href'
      )
    })
  }, [value])

  useEffect(() => {
    setKeys((current) => {
      return array_unique(hrefs.map((o) => o.category).concat(current))
    })
  }, [hrefs])

  return (
    <div className="container">
      {keys.map((key, i) => {
        return (
          <div key={key + i}>
            <h5>{key}</h5>
            <div>
              {hrefs
                .filter((item) => item.category === key && item.href.length > 0)
                .map((item, ii) => {
                  if (
                    !isValidHttpUrl(item.href) &&
                    !item.href.includes('/chimeraland')
                  ) {
                    item.href = '/chimeraland' + item.href
                  }
                  const _k = JSON.stringify(item) + ii
                  if (
                    /\/(ads|free-operating-systems)\/|index2/.test(item.href)
                  ) {
                    return <></>
                  }

                  return (
                    <a href={item.href} key={_k + 'a'}>
                      {item.href}
                    </a>
                  )
                })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

class SCache {
  static links = new Set<string>()
}

export function SitemapCache2(props?: Partial<OutboundLinkpropTypes>) {
  SCache.links.add(props.href)
}

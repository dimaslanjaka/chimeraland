import { useEffect } from 'react'
import { getStorageData } from '../hooks/useLocalStorage'
import { array_unique } from '../utils/array'
import { array_jsx_join } from '../utils/array-jsx'
import { capitalizer } from '../utils/string'
import { OutboundLinkpropTypes } from './react-seo-meta-tags/OutboundLink'

export function Sitemap() {
  const hrefs = array_unique(
    SitemapCacher.get()
      .map((href) => {
        href = href.replace('/chimeraland/', '/')
        const category = capitalizer(href.split(/\//)[1])
        return {
          category,
          href
        }
      })
      .filter((o) => o.category.length > 3),
    'href'
  )
  const keys = array_unique(hrefs.map((o) => o.category))
  const gets = keys.map((key, i) => {
    const hyperlinks = array_jsx_join(
      hrefs
        .filter((item) => item.category === key)
        .map((item) => (
          <a href={'/chimeraland' + item.href} key={item.href}>
            {item.href}
          </a>
        )),
      <span className="me-1" />
    )

    return (
      <div key={key + i}>
        <h5>{key}</h5>
        <div>{hyperlinks}</div>
      </div>
    )
  })
  return <div className="container">{array_jsx_join(gets)}</div>
}

export class SitemapCacher {
  static items: string[] = []
  static push(url: string) {
    if (this.items) this.items.push(url)
    SitemapCacher.items.push(url)
  }
  push = SitemapCacher.push
  get = SitemapCacher.get
  static get() {
    return array_unique(SitemapCacher.items)
  }
  set = SitemapCacher.set
  static set(sitemaps: string[]) {
    SitemapCacher.items = array_unique(sitemaps)
  }
}

export const SitemapCache = ({ href }: OutboundLinkpropTypes) => {
  const keyName = 'sitemap'
  const initialValue = [href]

  useEffect(() => {
    const value = array_unique(
      getStorageData(keyName, initialValue)
        .concat(initialValue)
        .map((str) => {
          if (!/chimeraland\//i.test(str)) return '/chimeraland' + str
          return str
        })
    )
    SitemapCacher.set(value)
    localStorage.setItem(keyName, JSON.stringify(value))
  })
}

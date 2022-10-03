import { useEffect, useState } from 'react'
import { array_unique } from '../utils/array'
import { array_jsx_join } from '../utils/array-jsx'
import { capitalizer } from '../utils/string'
import { OutboundLinkpropTypes } from './react-seo-meta-tags/OutboundLink'

const keyName = 'sitemap'

export function Sitemap() {
  const [value] = useState(SitemapCache())
  const hrefs = array_unique(
    value
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

export const SitemapCache = (props?: Partial<OutboundLinkpropTypes>) => {
  const initialValue = [props?.href] as string[]
  let result: string[] = []
  const savedItem = (result = JSON.parse(
    localStorage.getItem(keyName) || '[]'
  ) as string[])

  useEffect(() => {
    const value = array_unique(
      savedItem.concat(initialValue).map((str) => {
        if (!/\/chimeraland/i.test(str)) return '/chimeraland' + str
        return str
      })
    )
    result = value
    //console.log(value.length)
    localStorage.setItem(keyName, JSON.stringify(value))
  })

  return result
}

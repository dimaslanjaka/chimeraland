import { MaterialsData, MonstersData, RecipesData } from '../utils/chimeraland'
import { OutboundLink } from './react-seo-meta-tags/OutboundLink'

export const SitemapCache: string[] = []
export function Sitemap() {
  document.title = 'Sitemap - Chimeraland WMI'
  return (
    <div className="container">
      <div className="m-2">
        {MonstersData.map((item, i) => {
          const pathname = item.pathname
          SitemapCache.push(pathname)
          return (
            <OutboundLink
              href={pathname}
              key={item.type + i}
              legacy={true}
              className="me-2">
              {item.name}
            </OutboundLink>
          )
        })}
      </div>

      <div className="m-2">
        {RecipesData.map((item, i) => {
          const pathname = item.pathname
          SitemapCache.push(pathname)
          return (
            <OutboundLink
              className="me-2"
              href={pathname}
              key={item.type + i}
              legacy={true}>
              {item.name}
            </OutboundLink>
          )
        })}
      </div>

      <div className="m-2">
        {MaterialsData.map((item, i) => {
          const pathname = item.pathname
          SitemapCache.push(pathname)
          return (
            <OutboundLink
              className="me-2"
              href={pathname}
              key={item.type + i}
              legacy={true}>
              {item.name}
            </OutboundLink>
          )
        })}
      </div>
    </div>
  )
}

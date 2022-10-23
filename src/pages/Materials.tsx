import moment from 'moment-timezone'
import { Helmet } from 'react-helmet'
import { adsArticle } from '../components/adsense/myads'
import { OutboundLink } from '../components/react-seo-meta-tags/OutboundLink'
import { ReactSEOMetaTags } from '../components/react-seo-meta-tags/ReactSEOMetaTags'
import { MaterialsData } from '../utils/chimeraland'
import { capitalizer } from '../utils/string'
import { pathname2url } from '../utils/url'

type MaterialProps = typeof MaterialsData[number]
export function Material(props: MaterialProps) {
  const siteMetadata = {
    url: pathname2url(props.pathname),
    title: props.name + ' - Chimeraland',
    datePublished: props.datePublished,
    dateModified: props.dateModified,
    description: props.name + ' - Chimeraland',
    language: 'en-US,id',
    image:
      typeof props.images[0] === 'string'
        ? props.images[0]
        : 'https://via.placeholder.com/250x180.png?text=' + props.name,
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
  return (
    <>
      <ReactSEOMetaTags
        render={(el: React.ReactNode) => <Helmet>{el}</Helmet>}
        website={{ ...siteMetadata }}
      />

      <div className="container">
        <nav aria-label="breadcrumb">
          <ol
            className="breadcrumb"
            itemScope={true}
            itemType="https://schema.org/BreadcrumbList">
            <li
              className="breadcrumb-item"
              itemProp="itemListElement"
              itemScope={true}
              itemType="https://schema.org/ListItem">
              <OutboundLink
                href="/chimeraland"
                itemProp="item"
                legacy={true}
                className="text-decoration-none">
                <span itemProp="name">Home</span>
                <meta itemProp="position" content="1" />
              </OutboundLink>
            </li>
            <li
              className="breadcrumb-item"
              itemProp="itemListElement"
              itemScope={true}
              itemType="https://schema.org/ListItem">
              <OutboundLink
                href={'/chimeraland/' + props.type}
                legacy={true}
                itemProp="item"
                itemScope={true}
                itemType="https://schema.org/WebPage"
                itemID={'/chimeraland/' + props.type}
                className="text-decoration-none">
                <span itemProp="name">{capitalizer(props.type)}</span>
                <meta itemProp="position" content="2" />
              </OutboundLink>
            </li>
            <li
              className="breadcrumb-item active"
              aria-current="page"
              itemProp="itemListElement"
              itemScope={true}
              itemType="https://schema.org/ListItem">
              <span itemProp="name">{props.name}</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </nav>

        <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm position-relative">
          <div className="col p-4 d-flex flex-column position-static">
            <strong className="d-inline-block mb-2 text-success">
              {props.type}
            </strong>
            <h3 className="mb-0">{props.name}</h3>
            <div className="mb-1 text-muted">
              {moment(props.dateModified).format('LLL')}
            </div>
            {'background-info' in props && (
              <div className="mb-2 border p-1">
                {props['background-info'] || siteMetadata.title}
              </div>
            )}
            <a href="#" className="stretched-link d-none">
              Continue reading {props.name}
            </a>
          </div>
          <div className="col-auto d-none d-lg-block">
            <img src={props.images[0].pathname} alt={props.name} />
          </div>
        </div>

        <div className="row">
          <div className="col-12 h-md-250">
            {adsArticle('Material-1' + props.name)}
          </div>
          <div className="col-lg-6 col-12">
            {'details' in props && (
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    What is the use of the {props.name}
                  </h5>
                  <div className="card-text">
                    <ul>
                      {(props.details as string[]).map((str, i) => (
                        <li key={'details' + i}>{str}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-6 col-12">
            {'howto' in props && (
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">How to get {props.name}</h5>
                  <div className="card-text">
                    <ul>
                      {(props.howto as string[]).map((str, i) => (
                        <li key={'details' + i}>{str}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-12">
            {props.images.length > 1 && <h5>{props.name} Spawn Locations</h5>}
            {props.images.length > 1 &&
              (
                props.images as {
                  absolutePath: string
                  pathname: string
                }[]
              ).map((o, ii) => {
                if (!/mount/i.test(o.pathname)) return <></>
                const split = o.pathname.split(/\//g)
                const imgTitle = split[split.length - 1]
                  .substring(0, split[split.length - 1].lastIndexOf('.'))
                  .split(/-/g)
                  .map((str) => capitalizer(str))
                  .join(' ')
                return (
                  <div key={o.pathname + ii} className="p-4">
                    <h5>{imgTitle}</h5>
                    <img
                      src={o.pathname}
                      alt={props.name}
                      data-fancybox="true"
                      width="100%"
                    />
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </>
  )
}

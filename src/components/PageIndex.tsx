import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { array_jsx_join } from '../utils/array-jsx'
import {
  AttendantsData,
  MaterialsData,
  MonstersData,
  RecipesData
} from '../utils/chimeraland'
import { capitalizer } from '../utils/string'
import { pathname2url } from '../utils/url'
import { OutboundLink } from './react-seo-meta-tags/OutboundLink'
import { ReactSEOMetaTags } from './react-seo-meta-tags/ReactSEOMetaTags'

interface PropsIndex {
  tab: 'monsters' | 'attendants' | 'recipes' | 'materials'
}
type _MergedData = typeof MaterialsData[number] &
  typeof RecipesData[number] &
  typeof MonstersData[number] &
  typeof AttendantsData[number]
export function PageIndex(props: PropsIndex) {
  const [query, setQuery] = useState('')
  const searchData = MonstersData.concat(AttendantsData as any)
    .concat(MaterialsData as any)
    .concat(RecipesData as any)
    .filter((item) => item.type === props.tab)
    .filter((item) => {
      if (query === '') {
        //if query is empty
        return item
      } else if (item.name.toLowerCase().includes(query.toLowerCase())) {
        //returns filtered array
        return item
      }
    })
    .map((item: _MergedData, i, items) => {
      let col = 'col-12'
      if (items.length > 1) col = 'col-12 col-lg-6'
      if (props.tab === 'recipes') col = 'col-12' // make recipes always col-12

      let src =
        typeof item.images[0] === 'object'
          ? item.images[0].pathname
          : 'https://via.placeholder.com/250x180.png?text=' + item.name
      if (props.tab === 'recipes') {
        if ('icon' in item.images) {
          src = item.images.icon.pathname
        }
      }

      let description = <></>
      if (props.tab === 'recipes') {
        description = array_jsx_join(
          item.recipes
            .map((recipe, i) => (
              <p key={recipe + i} className="border rounded p-2 m-1">
                Recipe {i + 1}: {recipe}
              </p>
            ))
            .concat([
              <p key="device" className="border rounded p-2 m-1">
                Device: {item.device || 'Stove/Camp'}{' '}
              </p>
            ]),
          ''
        )
      }

      return (
        <div key={i} className={'mb-2 ' + col}>
          <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <div className="col p-4 d-flex flex-column position-static">
              <h5 className="mb-0">{item.name}</h5>
              <div className="card-text mb-auto">{description}</div>
              <OutboundLink
                href={item.pathname}
                className="stretched-link"
                legacy={true}>
                Continue reading
              </OutboundLink>
            </div>
            <div className="col-auto d-none d-lg-block">
              <img
                className="bd-placeholder-img"
                width="200"
                height="250"
                src={src}
              />
            </div>
          </div>
        </div>
      )
    })

  const siteMetadata = {
    url: pathname2url(props.tab),
    title: capitalizer(props.tab) + ' - Chimeraland',
    //datePublished: props.datePublished,
    //dateModified: props.dateModified,
    description: capitalizer(props.tab) + ' - Chimeraland',
    language: 'en-US,id',
    image:
      'https://via.placeholder.com/250x180.png?text=' + capitalizer(props.tab),
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
        <h1 className="fs-5 text-center">
          Chimeraland {capitalizer(props.tab)}
        </h1>
        <div className="row">
          <div className="col-12 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="type monster"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="row">{searchData}</div>
      </div>
    </>
  )
}

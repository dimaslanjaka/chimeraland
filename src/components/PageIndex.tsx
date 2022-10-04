import { useState } from 'react'
import { MonstersData } from '../utils/chimeraland'
import { OutboundLink } from './react-seo-meta-tags/OutboundLink'

interface PropsIndex {
  tab: 'monsters' | 'attendants' | 'recipes' | 'materials'
}
export function PageIndex(props: PropsIndex) {
  const [query, setQuery] = useState('')
  const searchData = MonstersData.filter((item) => item.type === props.tab)
    .filter((item) => {
      if (query === '') {
        //if query is empty
        return item
      } else if (item.name.toLowerCase().includes(query.toLowerCase())) {
        //returns filtered array
        return item
      }
    })
    .map((item, i, items) => {
      return (
        <div
          key={i}
          className={
            'mb-2 ' + (items.length > 1 ? 'col-12 col-lg-6' : 'col-12')
          }>
          <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <div className="col p-4 d-flex flex-column position-static">
              <h5 className="mb-0">{item.name}</h5>
              <OutboundLink href={item.pathname} className="stretched-link">
                Continue reading
              </OutboundLink>
            </div>
            <div className="col-auto d-none d-lg-block">
              <img
                className="bd-placeholder-img"
                width="200"
                height="250"
                src={
                  item.images[0]
                    ? item.images[0].pathname
                    : 'https://via.placeholder.com/250x180.png?text=' +
                      item.name
                }
              />
            </div>
          </div>
        </div>
      )
    })
  return (
    <>
      <div className="container">
        <h1 className="fs-5 text-center">Chimeraland Monsters</h1>
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

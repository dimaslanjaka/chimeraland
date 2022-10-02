import React from 'react'
import logo from '../logo.svg'
import searchData from '../utils/search.json'
import './Nav.scss'
import { OutboundLink } from './react-seo-meta-tags/OutboundLink'

type SearchDataType = typeof searchData & {
  [key: string]: any
}

export function Nav() {
  const [query, setQuery] = React.useState('')
  const textInput = React.createRef<HTMLInputElement>()
  function search(keyword?: string) {
    if (typeof keyword !== 'string' && textInput.current) {
      keyword = textInput.current.value
    }
    if (typeof keyword === 'string') {
      setQuery(keyword)
    }
    const filtered: SearchDataType = searchData.filter((item) => {
      if (query.trim().length === 0) return false
      if (new RegExp('^' + query + '$', 'i').test(item.name)) return true
      if (new RegExp(query, 'i').test(item.name)) return true
    })
    return filtered
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top py-2">
        <div className="container-fluid">
          <OutboundLink className="navbar-brand" href="#">
            <img src={logo} alt="" width="30" height="24" />
          </OutboundLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <OutboundLink
                  className="nav-link active"
                  aria-current="page"
                  href="/">
                  Home
                </OutboundLink>
              </li>
              <li className="nav-item">
                <OutboundLink
                  className="nav-link"
                  href="https://www.webmanajemen.com/The%20Legend%20Of%20Neverland/Quiz.html">
                  TLON Quiz
                </OutboundLink>
              </li>
              <li className="nav-item dropdown">
                <OutboundLink
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  Chimeraland
                </OutboundLink>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <OutboundLink
                      className="dropdown-item"
                      href="/chimeraland/monsters">
                      Monsters
                    </OutboundLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <OutboundLink
                      className="dropdown-item"
                      href="/chimeraland/attendants">
                      Attendants
                    </OutboundLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <OutboundLink
                      className="dropdown-item"
                      href="/chimeraland/recipes.html">
                      Recipes
                    </OutboundLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <OutboundLink
                  className="nav-link disabled"
                  href="#"
                  tabIndex={-1}
                  aria-disabled="true">
                  Disabled
                </OutboundLink>
              </li>
            </ul>
            <form id="sbx" className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                ref={textInput}
                //onBlur={(_e) => search('')}
                onFocus={(_e) => search(_e.target.value)}
                onChange={(_e) => search(_e.target.value)}
              />
              {/*<button
                className="btn btn-outline-success"
                type="submit"
                onClick={(_e) => search()}>
                Search
  </button>*/}
              <div className="box-wrapper">
                {search().map((item, index) => {
                  return (
                    <div className="box" key={index}>
                      <OutboundLink
                        className="me-2"
                        href={item.pathname}
                        legacy={true}>
                        {item.type}:
                      </OutboundLink>
                      <OutboundLink legacy={true} href={item.pathname}>
                        {item.name}
                      </OutboundLink>
                    </div>
                  )
                })}
              </div>
            </form>
          </div>
        </div>
      </nav>
    </>
  )
}

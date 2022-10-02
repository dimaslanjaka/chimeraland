import React from 'react'
import '../App.scss'
import logo from '../logo.svg'

export class Home extends React.Component {
  render() {
    return (
      <>
        <div className="App" style={{ overflow: 'hidden' }}>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>
        </div>

        <div className="text-center mt-5">
          <a href="/chimeraland/sitemap" style={{ zIndex: 1000 }}>
            sitemap
          </a>
        </div>
      </>
    )
  }
}

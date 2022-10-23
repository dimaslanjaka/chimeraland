import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Route, Routes } from 'react-router-dom'
import './App.scss'
import { Attendant } from './components/Attendant'
import { Footer } from './components/Footer'
import { Home } from './components/Home'
import { Nav } from './components/Nav'
import { NoMatch } from './components/NoMatch'
import { PageIndex } from './components/PageIndex'
import { ReactSEOMetaTags } from './components/react-seo-meta-tags/ReactSEOMetaTags'
import { Safelink } from './components/Safelink'
import { Sidebar } from './components/Sidebar'
import { Sitemap, SitemapCache2 } from './components/Sitemap'
import { Fancybox } from './fancybox/src'
import { Material } from './pages/Materials'
import { Monster } from './pages/Monster'
import { Recipes } from './pages/Recipes'
import { ScenicSpots } from './pages/ScenicSpots'
import {
  AttendantsData,
  MaterialsData,
  MonstersData,
  RecipesData
} from './utils/chimeraland'
 export default function App() {
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

  return (
    <main>
      <ReactSEOMetaTags
        render={(el: React.ReactNode) => <Helmet>{el}</Helmet>}
        website={{ title: 'Unofficial Chimeraland' }}
      />
      <Nav />
      <div className="row g-5" style={{ marginTop: '1.5rem', width: '100%' }}>
        <div id="m-contents" className="col-md-8">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route
              path="/monsters"
              element={<PageIndex tab="monsters" />}></Route>
            <Route
              path="/monsters/index.html"
              element={<PageIndex tab="monsters" />}></Route>
            <Route
              path="/materials"
              element={<PageIndex tab="materials" />}></Route>
            <Route
              path="/materials/index.html"
              element={<PageIndex tab="materials" />}></Route>
            <Route
              path="/recipes"
              element={<PageIndex tab="recipes" />}></Route>
            <Route
              path="/recipes/index.html"
              element={<PageIndex tab="recipes" />}></Route>
            <Route
              path="/attendants"
              element={<PageIndex tab="attendants" />}></Route>
            <Route
              path="/attendants/index.html"
              element={<PageIndex tab="attendants" />}></Route>
            <Route path="/scenic-spots" element={<ScenicSpots />}></Route>
            <Route path="/loan-insurance" element={<Safelink />}></Route>
            {MonstersData.map((item, i) => {
              const pathname = item.pathname.replace('chimeraland/', '')
              SitemapCache2({ href: pathname })
              return (
                <Route
                  path={pathname}
                  key={item.type + i}
                  element={<Monster key={'Element-Monster-' + i} {...item} />}
                />
              )
            })}
            {RecipesData.map((item, i) => {
              const pathname = item.pathname.replace('chimeraland/', '')
              SitemapCache2({ href: pathname })
              return (
                <Route
                  path={pathname}
                  key={item.type + i}
                  element={<Recipes key={'Element-Recipe-' + i} {...item} />}
                />
              )
            })}
            {MaterialsData.map((item, i) => {
              const pathname = item.pathname.replace('chimeraland/', '')
              SitemapCache2({ href: pathname })
              return (
                <Route
                  path={pathname}
                  key={item.type + i}
                  element={<Material key={'Element-Material-' + i} {...item} />}
                />
              )
            })}

            {AttendantsData.map((item, i) => {
              const pathname = item.pathname.replace('chimeraland/', '')
              SitemapCache2({ href: pathname })
              return (
                <Route
                  path={pathname}
                  key={item.type + i}
                  element={
                    <Attendant key={'Element-Attendant-' + i} {...item} />
                  }
                />
              )
            })}

            <Route path="/sitemap" element={<Sitemap />} />
            {/* Using path="*"" means "match anything", so this route
              acts like a catch-all for URLs that we don't have explicit
              routes for. */}
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </div>

        <div id="m-sidebar" className="col-md-4">
          <Sidebar />
        </div>
      </div>
      <Footer />
    </main>
  )
}

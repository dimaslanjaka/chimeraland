import { Route, Routes } from 'react-router-dom'
import './App.scss'
import { Footer } from './components/Footer'
import { Home } from './components/Home'
import { Material } from './components/Materials'
import { Monster } from './components/Monster'
import { Nav } from './components/Nav'
import { NoMatch } from './components/NoMatch'
import { Recipes } from './components/Recipes'
import { Sidebar } from './components/Sidebar'
import { Sitemap } from './components/Sitemap'
import { MaterialsData, MonstersData, RecipesData } from './utils/chimeraland'

export default function App() {
  return (
    <>
      <Nav />
      <div className="row g-5" style={{ marginTop: '1.5rem' }}>
        <div className="col-md-8">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/monsters" element={<Home />}></Route>
            <Route path="/materials" element={<Home />}></Route>
            <Route path="/recipes" element={<Home />}></Route>
            <Route path="/attendants" element={<Home />}></Route>
            {MonstersData.map((item, i) => {
              const pathname = item.pathname.replace('chimeraland/', '')

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

              return (
                <Route
                  path={pathname}
                  key={item.type + i}
                  element={<Material key={'Element-Material-' + i} {...item} />}
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

        <div className="col-md-4">
          <Sidebar />
        </div>
      </div>
      <Footer />
    </>
  )
}

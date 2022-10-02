import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { ReactSEOMetaTags } from './react-seo-meta-tags/ReactSEOMetaTags'

export function NoMatch() {
  let url = location.href
  let redirect = false
  if (url.includes('/Chimeraland')) {
    url = url.replace('/Chimeraland', '/chimeraland')
    redirect = true
  }
  if (url.includes('/Monsters')) {
    url = url.replace('/Monsters', '/monsters')
    redirect = true
  }
  if (url.includes('/Attendants')) {
    url = url.replace('/Attendants', '/attendants')
    redirect = true
  }
  if (url.endsWith('/Recipes.html')) {
    url = url.replace('/Recipes.html', '/recipes.html')
    redirect = true
  }
  if (redirect) {
    //alert(`url migrated and redirecting to ${url}`);
    window.location.href = url
    document.head.innerHTML += `<link rel="canonical" href="${url}" />`
  }
  const meta = {
    title: '404 not found',
    url: 'https://www.webmanajemen.com/chimeraland/404.html',
    description: '404 not found - Unofficial Wikipedia Chimeraland',
    datePublished: new Date().toDateString(),
    dateModified: new Date().toDateString(),
    language: 'en-US,id',
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
        {...meta}
        render={(el: React.ReactNode) => <Helmet>{el}</Helmet>}
      />
      <div>
        <h2>Nothing to see here!</h2>
        <p>
          <Link to="/">Go to the home page</Link>
        </p>
      </div>
    </>
  )
}

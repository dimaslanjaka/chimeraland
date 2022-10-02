// polyfill
//import 'core-js/actual/array/from'
//import 'core-js/actual/array/group'
//import 'core-js/actual/promise'
//import 'core-js/actual/queue-microtask'
//import 'core-js/actual/set'
//import 'core-js/actual/structured-clone'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
// bootstrap
import '@popperjs/core/dist/umd/popper.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
// main
import ReactDOM, { hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Metric } from 'web-vitals'
import App from './App'
import { Sitemap } from './components/Sitemap'
import './index.scss'
import reportWebVitals from './reportWebVitals'

const rootElement = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(rootElement)
// console.log(process.env.PUBLIC_URL)
const children = (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/sitemap" element={<Sitemap />} />
      </Routes>
    </BrowserRouter>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </>
)

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, children)
} else {
  root.render(children)
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
function sendToAnalytics(metric: Metric) {
  const val =
    typeof metric.value !== 'number' ? parseInt(metric.value) : metric.value
  const properties = Object.assign(metric, {
    event_category: 'web-vitals',
    value: Math.round(metric.name === 'CLS' ? val * 1000 : val), // values must be integers
    event_label: metric.name,
    title: document.title,
    nonInteraction: true // avoids affecting bounce rate
  } as Gtag.ControlParams & Gtag.EventParams & Gtag.CustomParams)
  if (typeof window.gtag === 'function') {
    // https://developers.google.com/analytics/devguides/collection/gtagjs
    // https://developers.google.com/gtagjs/reference/event#timing_complete
    window.gtag('event', 'coreWebVitals', properties)
  } else {
    console.log('google analystic not installed', properties)
  }
}
reportWebVitals(sendToAnalytics)

/* eslint-disable @typescript-eslint/no-this-alias */
import { JSDOM } from 'jsdom'
import pkg from './package.json'
import { snapshot3 } from './snapshot3'
import { array_unique } from './src/utils/array'
import { SSGRoutes } from './ssg.routes'

export class Snapshot {
  links = new Set<string>()
  scrape(url: string) {
    const self = this
    snapshot3(url, function (html) {
      html = self.filter(html)
      console.log(url, html.length)
    })
  }

  /**
   * remove unwanted html
   * @param html
   * @returns
   */
  filter(html: string | ArrayBuffer | DataView | undefined) {
    // parsing
    const dom = new JSDOM(html)
    const { window } = dom
    const { document } = window
    // remove unused elements
    const selectors = [
      "script[src*='adsid/integrator.js']",
      "script[src*='partner.googleadservices.com']",
      "script[src*='show_ads_impl.js']",
      "link[href*='adsid/integrator.js']",
      "meta[http-equiv='origin-trial']",
      "iframe[src*='googleads.g.doubleclick.net']",
      "iframe[src='https://www.google.com/recaptcha/api2/aframe']",
      '.adsbygoogle-noablate',
      'script[src="https://www.googletagmanager.com/gtag/js"]',
      'iframe[src*="tpc.googlesyndication.com"]'
      //'script[src*="main."]',
    ]
    selectors
      .map((selector) => Array.from(document.querySelectorAll(selector)))
      .forEach((arr) => arr.map((el) => el.remove()))
    // remove duplicate src script
    const scripts: string[] = []
    document.querySelectorAll('script').forEach((el) => {
      if (scripts.includes(el.src)) {
        el.remove()
      } else {
        scripts.push(el.src)
      }
    })
    // remove inner html ins
    Array.from(document.querySelectorAll('ins.adsbygoogle')).forEach((el) => {
      el.innerHTML = ''
      el.removeAttribute('data-ad-status')
      el.removeAttribute('data-adsbygoogle-status')
    })
    // set identifier
    document
      .querySelectorAll('body,html,header,footer')
      .forEach((el) => el.setAttribute('react-static', 'true'))
    // get internal links
    const anchors = Array.from(document.querySelectorAll('a'))
    const internal_links = array_unique(
      anchors
        .filter(
          (a) =>
            a.href.startsWith('/') &&
            !/.(jpeg|jpg|gif|svg|ico|png)$/i.test(a.href)
        )
        .map((a) => a.href)
        .concat(SSGRoutes)
        .filter(
          (href) =>
            typeof href === 'string' &&
            href.startsWith('/') &&
            !/.(jpeg|jpg|gif|svg|ico|png)$/i.test(href) &&
            href.length > 0
        )
    ).filter(
      (str) =>
        typeof str === 'string' &&
        str.length > 0 &&
        !str.startsWith('/undefined')
    )
    internal_links.forEach((item) => {
      if (item.trim().length > 0) this.links.add(item)
    })
    // seo external links
    const hostname = new URL(pkg.homepage).host
    anchors
      .filter((a) => /^https?:\/\//.test(a.href) && !a.href.includes(hostname))
      .forEach((a) => {
        a.rel = 'nofollow noopener noreferer'
        a.target = '_blank'
      })
    window.close()
    return dom.serialize()
  }
}

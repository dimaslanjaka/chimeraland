/* eslint-disable @typescript-eslint/no-this-alias */
import Bluebird from 'bluebird'
import { JSDOM } from 'jsdom'
import { launch } from 'puppeteer'
import pkg from './package.json'
import renderSnap from './packages/prerender-chrome-headless'
import { defaultArg } from './puppeteer'
import { array_unique } from './src/utils/array'
import { catchMsg } from './src/utils/noop'
import { SSGRoutes } from './ssg.routes'

export class Snapshot {
  links = new Set<string>()
  scraping = false

  async scrape(url: string) {
    if (this.scraping) return null
    this.scraping = true
    const browser = await launch({
      headless: false,
      timeout: 3 * 60 * 1000,
      args: defaultArg
    })
    const page = await browser.newPage()
    page.on('pageerror', catchMsg)
    await page.goto(url, { waitUntil: 'networkidle0' })
    //await page.waitForNetworkIdle()
    const content = page.content()
    await browser.close()
    this.scraping = false
    return content
  }

  scrape2(url: string) {
    const self = this
    return new Bluebird((resolve: (str: string) => any, reject) => {
      renderSnap(url)
        .then(function (html) {
          resolve(self.filter(html))
        })
        .catch(reject)
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

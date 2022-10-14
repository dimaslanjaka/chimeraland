/* eslint-disable @typescript-eslint/no-this-alias */
import { BinaryData, JSDOM } from 'jsdom'
import prettier from 'prettier'
import { launch } from 'puppeteer'
import prettierOptions from './.prettierrc'
import pkg from './package.json'
import { defaultArg } from './puppeteer'
import { array_unique } from './src/utils/array'
import { isDev } from './src/utils/env'
import { catchMsg } from './src/utils/noop'

export class Snapshot {
  links = new Set<string>()
  scraping = false

  async scrape(url: string) {
    if (this.scraping) return null
    this.scraping = true
    const browser = await launch({
      headless: true,
      timeout: 3 * 60 * 1000,
      args: defaultArg
    })
    const page = await browser.newPage()
    page.on('pageerror', catchMsg)
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 3 * 60 * 1000 })
    await page.waitForNetworkIdle()
    const content = await page.content()
    await browser.close()
    this.scraping = false
    let result = await this.removeUnwantedHtml(content)
    result = await this.removeDuplicateScript(result)
    result = await this.fixAdsenseFromHtml(result)
    result = await this.fixSeoFromHtml(result)
    result = await this.setIdentifierFromHtml(result)
    if (isDev) {
      return prettier.format(
        result,
        Object.assign(prettierOptions, { parser: 'html' })
      )
    }
    return result
  }

  async removeUnwantedHtml(html: string | ArrayBuffer | DataView) {
    const dom = new JSDOM(html)
    const window = dom.window
    const document = dom.window.document
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
    const result = await this.serializeHtml(dom).finally(() => {
      window.close()
    })
    return result
  }

  async removeDuplicateScript(html: string | ArrayBuffer | DataView) {
    // parsing
    const dom = new JSDOM(html)
    const window = dom.window
    const document = dom.window.document

    // remove duplicate src script
    const scripts: string[] = []
    document.querySelectorAll('script').forEach((el) => {
      if (scripts.includes(el.src)) {
        el.remove()
      } else {
        scripts.push(el.src)
      }
    })
    const result = await this.serializeHtml(dom).finally(() => {
      window.close()
    })
    return result
  }

  async fixAdsenseFromHtml(html: string | ArrayBuffer | DataView) {
    // parsing
    const dom = new JSDOM(html)
    const window = dom.window
    const document = dom.window.document

    // remove inner html ins
    Array.from(document.querySelectorAll('ins.adsbygoogle')).forEach((el) => {
      el.innerHTML = ''
      el.removeAttribute('data-ad-status')
      el.removeAttribute('data-adtest')
      el.removeAttribute('data-adsbygoogle-status')
    })
    const result = await this.serializeHtml(dom).finally(() => {
      window.close()
    })
    return result
  }

  async fixSeoFromHtml(html: string | Buffer | BinaryData) {
    // parsing
    const dom = new JSDOM(html)
    const window = dom.window
    const document = dom.window.document

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

    const result = await this.serializeHtml(dom).finally(() => {
      window.close()
    })
    return result
  }

  async setIdentifierFromHtml(
    html: string | ArrayBuffer | DataView | undefined
  ) {
    if (!html) throw new Error('html empty')

    // parsing
    const dom = new JSDOM(html)
    const window = dom.window
    const document = dom.window.document

    // set identifier
    Array.from(document.querySelectorAll('body,html,header,footer')).forEach(
      (el) => el.setAttribute('react-static', 'true')
    )

    const result = await this.serializeHtml(dom).finally(() => {
      window.close()
    })
    return result
  }

  async serializeHtml(dom: JSDOM) {
    try {
      return dom.serialize()
    } catch {
      return document.documentElement.outerHTML
    }
  }

  static isPathNonHtml(str: string) {
    return /.(png|jpe?g|ico|txt|gif|svg|mp4)$/.test(str)
  }

  static isPathHasExt(str: string) {
    if (str.endsWith('/')) return false
    return /\.\w+$/.test(str)
  }

  static fixUrl(url: string | URL) {
    let str: string
    if (typeof url === 'string') {
      str = url
    } else {
      str = url.toString()
    }
    return str.replace(/([^:]\/)\/+/g, '$1')
  }
}

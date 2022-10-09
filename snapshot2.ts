import { default as debugLib } from 'debug'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { JSDOM } from 'jsdom'
import prettier from 'prettier'
import puppeteer from 'puppeteer'
import { dirname, join } from 'upath'
import ExpressServer from './express'
import pkg from './package.json'
import { color } from './src/utils/color'

const _debug = debugLib('chimera-snapshot')

ExpressServer(4000).then((_express) => {
  const baseDir = join(__dirname, 'build')
  const snap = new SnapShot({ baseDir, baseUrl: pkg.homepage })
  snap.scrape('/sitemap')
  process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.')
    _express.server.close(() => {
      console.log('Http server closed.')
    })
  })
})

// return array of promises
interface writeProp {
  baseDir: string
  filename: string
  content: string
}

interface SnapShotOpt {
  /**
   * Save location
   */
  baseDir: string
  /**
   * Base url
   */
  baseUrl: string
}

export class SnapShot {
  baseDir: SnapShotOpt['baseDir']
  baseUrl: SnapShotOpt['baseUrl']

  /**
   * urls to navigate
   */
  urls: string[] = []

  constructor(opt: SnapShotOpt) {
    this.baseDir = opt.baseDir
    this.baseUrl = opt.baseUrl
  }

  async scrape(pageUrl: string) {
    const getSitemap = await this.navigate(this.fixUrl(pageUrl))
    if (typeof getSitemap === 'string') {
      const dom = new JSDOM(getSitemap)
      const { window } = dom
      const { document } = window
      const links = Array.from(document.querySelectorAll('a'))
        .filter((el) => {
          const href = el.href
          if (
            typeof href === 'string' &&
            href.startsWith('/') &&
            !href.endsWith('sitemap')
          ) {
            return true
          }
          return false
        })
        .map((el) => el.href)
      _debug('total internal links', links.length)
      for (let i = 0; i < links.length; i++) {
        const link = this.fixUrl(new URL(this.baseUrl + links[i]))
        //if (!done.includes(link)) await navigate(link)
        this.urls.push(link)
      }
      window.close()
    }
  }

  async navigate(pageUrl: string) {
    // skip empty url
    if (!pageUrl) return
    // skip non-html url
    if (/.(png|jpe?g|ico|txt|gif)$/.test(pageUrl)) {
      _debug(color.yellowBright('skip non-html file'), pageUrl)
      return
    }
    if (!/^https?:\/\//.test(pageUrl)) {
      pageUrl = this.fixUrl(new URL(this.baseUrl + pageUrl))
    }
    _debug('navigating', pageUrl)
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--user-data-dir=' + join(__dirname, 'tmp/puppeteer_profile'),
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--ignoreHTTPSErrors=true',
        '--user-agent="Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z‡ Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"'
      ],
      timeout: 3 * 60 * 1000
    })
    let result: string
    try {
      const page = await browser.newPage()
      // Configure the navigation timeout to 2 minutes, becuase sometimes site is too busy
      page.setDefaultNavigationTimeout(120000)

      await page.goto(pageUrl, { waitUntil: 'networkidle0' })
      // wait for #root
      await page.waitForSelector('#root', { timeout: 1000 })
      const html = await page.content()

      if (html) {
        result = this.parseHTML(html, new URL(pageUrl).pathname)
      } else {
        _debug('html invalid', pageUrl)
      }
      await browser.close()
      // add url to done indicator
      //done.push(pageUrl)
      //writeFileSync(donefile, done.join('\n'))
    } catch (e) {
      if (e instanceof puppeteer.errors.TimeoutError) {
        // Do something if this is a timeout.
        _debug(color.redBright('puppeteer timeout'), pageUrl)
      }
    }
    return result
  }

  parseHTML(html: string, pathname: string) {
    // parsing
    const dom = new JSDOM(html)
    const { window } = dom
    const { document } = window
    // check if html is react static
    /*const isReactStatic = /react-static=/gi.test(html)
    if (isReactStatic) {
      _debug(pathname, color.greenBright('is react static'))
      window.close()
      return prettier.format(dom.serialize(), { parser: 'html' })
    }*/
    // remove unused elements
    const selectors = [
      "script[src*='adsid/integrator.js']",
      "script[src*='partner.googleadservices.com']",
      "script[src*='dataLayer']",
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
    // saving
    const content = prettier.format(dom.serialize(), { parser: 'html' })
    let filePath: string | null = null
    const subfolder = new URL(pkg.homepage).pathname
    if (pathname === subfolder) {
      filePath = 'index.html'
    } else if (!pathname.endsWith('.html')) {
      // skip not html extension path
      if (!/\.\w+$/.test(pathname)) filePath = `${pathname}/index.html`
    } else {
      filePath = pathname
    }
    if (typeof filePath === 'string') {
      if (filePath.endsWith('.html')) {
        if (subfolder !== '/') filePath = filePath.replace(subfolder, '')
        _debug(`Saving ${pathname} as ${filePath}`)
        const dest = this.write({
          baseDir: this.baseDir,
          filename: filePath,
          content
        })
        _debug('Saved', dest.replace(process.cwd(), ''))
      } else {
        _debug('unSaved', filePath)
      }
    } else {
      _debug('$filePath empty')
    }
    dom.window.close()
    return content
  }

  fixUrl(url: string | URL) {
    let str: string
    if (typeof url === 'string') {
      str = url
    } else {
      str = url.toString()
    }
    return str.replace(/([^:]\/)\/+/g, '$1')
  }

  write(opt: writeProp) {
    const { baseDir, filename, content } = opt
    const newPath = join(baseDir, filename)
    const dirName = dirname(newPath)
    if (!existsSync(dirName)) mkdirSync(dirName, { recursive: true })
    writeFileSync(newPath, content)
    return newPath
  }
}

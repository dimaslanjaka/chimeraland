import { spawn } from 'child_process'
import debuglib from 'debug'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import jsdom from 'jsdom'
import { basename, dirname, join } from 'path'
import prettier from 'prettier'
import puppeteer from 'puppeteer'
import ExpressServer from './express'
import pkg from './package.json'
import { array_unique } from './src/utils/array'

const port = 4000
const debug = debuglib('chimera-static')

navigatorListener()

async function navigatorListener() {
  /*if (existsSync(join(baseDir, '200.html'))) {
    await _build()
    //throw new Error("please rebuild using `npm run build`");
  }*/
  const { app } = await ExpressServer(port)
  const homepageUrl = new URL(pkg.homepage)
  const baseUrl = new URL('http://localhost:' + port)
  const pageUrl = new URL(baseUrl)
  pageUrl.pathname = homepageUrl.pathname + '/sitemap'
  const donefile = join(__dirname, 'tmp/build/done.txt')
  const done: string[] = existsSync(donefile)
    ? readFileSync(donefile, 'utf-8')
        .split(/\r?\n/)
        .map((str) => str.trim())
    : []
  const navigate = async (pageUrl: string) => {
    // skip empty url
    if (!pageUrl) return
    debug('navigating', pageUrl)
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--user-data-dir=' + join(__dirname, 'tmp/puppeteer_profile')],
      timeout: 3 * 60 * 1000
    })
    const page = await browser.newPage()
    await page.goto(pageUrl, { waitUntil: 'networkidle0' })
    const html = await page.content()
    let result: string
    if (html) {
      result = parseHTML(html, new URL(pageUrl).pathname)
    } else {
      debug('html invalid', pageUrl)
    }
    await browser.close()
    done.push(pageUrl)
    writeFileSync(donefile, done.join('\n'))
    return result
  }
  let running = false
  const urlsFile = join(__dirname, 'tmp/build/urls.txt')
  let urls: string[] = existsSync(urlsFile)
    ? readFileSync(urlsFile, 'utf-8')
        .split(/\r?\n/)
        .map((str) => str.trim())
    : [fixUrl(pageUrl)]

  const scrape = async (pagePath?: string) => {
    if (pagePath) {
      pageUrl.pathname = pagePath
      urls.push(fixUrl(pageUrl))
    }

    // remove duplicate url from done
    urls = array_unique(
      urls.concat(fixUrl(pageUrl)).filter(function (el) {
        return done.indexOf(el) < 0
      })
    )
    write({
      baseDir: dirname(urlsFile),
      filename: basename(urlsFile),
      content: urls.sort(() => Math.random() - 0.5).join('\n')
    })

    if (running || urls.length == 0) return
    const current = urls[0]
    if (done.includes(current)) {
      urls.shift()
      return scrape()
    }
    running = true

    const getSitemap = await navigate(fixUrl(current))
    if (getSitemap) {
      const dom = new jsdom.JSDOM(getSitemap)
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
      debug('total internal links', links.length)
      for (let i = 0; i < links.length; i++) {
        const link = fixUrl(new URL(baseUrl + links[i]))
        //if (!done.includes(link)) await navigate(link)
        urls.push(link)
      }
      window.close()
    }
    running = false
    urls.shift()
    writeFileSync(
      urlsFile,
      array_unique(
        urls.filter(function (el) {
          return done.indexOf(el) < 0
        })
      ).join('\n')
    )
    if (urls.length > 0) scrape()
  }
  app.use((req, res, next) => {
    scrape(req.path)
    if (
      (req.method === 'GET' || req.method === 'HEAD') &&
      req.accepts('html')
    ) {
      res.sendFile(join(__dirname, 'build', '200.html'))
    } else {
      next()
    }
  })
  scrape()
  //server.listen(port, () => scrape())
  // server.app.closeAllConnections()
}

// return array of promises
interface writeProp {
  baseDir: string
  filename: string
  content: string
}
function write({ baseDir, filename, content }: writeProp) {
  const newPath = join(baseDir, filename)
  const dirName = dirname(newPath)
  if (!existsSync(dirName)) mkdirSync(dirName, { recursive: true })
  writeFileSync(newPath, content)
  return newPath
}

function parseHTML(html: string, pathname: string) {
  // parsing
  const dom = new jsdom.JSDOM(html)
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
      debug(`Saving ${pathname} as ${filePath}`)
      const dest = write({
        baseDir: join(__dirname, 'tmp/build'),
        filename: filePath,
        content
      })
      debug('Saved', dest.replace(process.cwd(), ''))
    } else {
      debug('unSaved', filePath)
    }
  } else {
    debug('$filePath empty')
  }
  dom.window.close()
  return content
}

async function _build() {
  const child = spawn('npm', ['run', 'build'])

  let data = ''
  for await (const chunk of child.stdout) {
    debug('stdout chunk: ' + chunk)
    data += chunk
  }
  let error = ''
  for await (const chunk of child.stderr) {
    console.error('stderr chunk: ' + chunk)
    error += chunk
  }
  const exitCode = await new Promise((resolve) => {
    child.on('close', resolve)
  })

  if (exitCode) {
    throw new Error(`subprocess error exit ${exitCode}, ${error}`)
  }
  return data
}

function fixUrl(url: string | URL) {
  let str: string
  if (typeof url === 'string') {
    str = url
  } else {
    str = url.toString()
  }
  return str.replace(/([^:]\/)\/+/g, '$1')
}

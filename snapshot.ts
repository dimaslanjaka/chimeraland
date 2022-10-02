import { spawn } from 'child_process'
import debuglib from 'debug'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import jsdom from 'jsdom'
import { dirname, join, resolve } from 'path'
import prettier from 'prettier'
import puppeteer from 'puppeteer'
import ExpressServer from './express'
import pkg from './package.json'

const port = 4000
const baseDir = resolve('./build')
const debug = debuglib('chimera-static')

navigatorListener()

async function navigatorListener() {
  /*if (existsSync(join(baseDir, '200.html'))) {
    await _build()
    //throw new Error("please rebuild using `npm run build`");
  }*/
  const server = await ExpressServer(port)

  const baseUrl = 'http://localhost:' + port
  const pageUrl = new URL(baseUrl + '/sitemap')
  const navigate = async (pageUrl: string) => {
    debug('navigating', pageUrl)
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()
    await page.goto(pageUrl, { waitUntil: 'networkidle0' })
    const html = await page.content()
    if (html) {
      return saveHTML(html, new URL(pageUrl).pathname)
    } else {
      debug('html invalid', pageUrl)
    }
    await browser.close()
  }
  const getSitemap = await navigate(pageUrl.toString())
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
    debug('total links', links.length)
    for (let i = 0; i < links.length; i++) {
      const link = new URL(baseUrl + links[i]).toString()
      await navigate(link)
    }
    window.close()
  }
  // server.closeAllConnections()
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

function saveHTML(html: string, pathname: string) {
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
    filePath = `${pathname}/index.html`
  } else {
    filePath = pathname
  }
  if (typeof filePath === 'string') {
    if (subfolder !== '/') filePath = filePath.replace(subfolder, '')
    debug(`Saving ${pathname} as ${filePath}`)
    const dest = write({
      baseDir,
      filename: filePath,
      content
    })
    debug('Saved', dest.replace(process.cwd(), ''))
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

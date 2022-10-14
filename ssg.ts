/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="node_modules/@types/serve-static/index.d.ts" />
import Bluebird from 'bluebird'
import 'core-js/actual/structured-clone'
import debuglib from 'debug'
import express from 'express'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from 'fs'
import { Server } from 'http'
import { JSDOM } from 'jsdom'
import { join } from 'path'
import path from 'upath'
import { workspace } from './express'
import pkg from './package.json'
import { SSGRoutes } from './shh.routes'
import { snapshot3 } from './snapshot3'
import { array_unique } from './src/utils/array'
import { color } from './src/utils/color'
import { isValidHttpUrl } from './src/utils/url'

const hostname = new URL(pkg.homepage).host
const pathname = new URL(pkg.homepage).pathname
/** React Generated Dir */
const reactDir = path.resolve('./build')
/** HexoJS Generated Dir */
const blogDir = path.resolve('./blog/public')
/** Folder generated */
const destDir = path.resolve('./.deploy_git')

const _debug = debuglib('chimera-express')
const _debugreact = debuglib('chimera-react')
const _debugasset = debuglib('chimera-asset')
const _debugsnap = debuglib('chimera-snap')
const debug = (suffix: string) => debuglib('chimera-' + suffix)

const blogIndex = path.join(blogDir, 'index.html')
const index = path.join(reactDir, 'index.html')
const index200 = path.join(reactDir, '200.html')
const index404 = path.join(reactDir, '404.html')
if (!existsSync(index)) throw new Error('index.html not exist in build')
if (!existsSync(index200)) copyFileSync(index, index200)
if (!existsSync(index404)) copyFileSync(index, index404)

const app = express()

app.use(express.static(blogDir))
app.use(pathname, express.static(blogDir))
app.use(express.static(reactDir))
app.use(pathname, express.static(reactDir))

app.get(pathname, (_, res) => {
  _debug('blog', workspace(blogIndex))
  return res.sendFile(blogIndex)
})

app.get(
  /(.*).(woff|ttf|woff2|css|js|svg|jpeg|jpg|png|gif|ico|json)/i,
  async (req, res) => {
    const currentPath = decodeURIComponent(req.path.replace(pathname, '/'))
    const paths = [
      path.join(blogDir, currentPath),
      path.join(reactDir, currentPath)
    ].filter((str) => existsSync(str))

    if (paths.length === 1) return res.sendFile(paths[0])

    _debugasset(currentPath, paths)
    return res.sendFile(index200)
  }
)

const links: string[] = []
const done: string[] = []
app.use(async (req, res) => {
  _debugreact(req.path, workspace(index200))
  if (!done.includes(req.path)) {
    done.push(req.path)
    collectLinks('http://localhost:4000' + req.path).each((url) =>
      links.push(url)
    )
  }
  return res.sendFile(index200)
})

new Bluebird((resolveServer: (s: Server) => any) => {
  const server = app.listen(4000, () => {
    _debug('listening http://adsense.webmanajemen.com:4000')
  })
  resolveServer(server)
}).then((server) => {
  const baseUrl = 'http://adsense.webmanajemen.com:4000' + pathname

  collectLinks(baseUrl)
    .each((url) => links.push(url))
    .then(() => {
      if (server.closeAllConnections) {
        server.closeAllConnections()
      } else {
        server.close()
      }
    })
})

const collectedFile = join(__dirname, 'build/collected.txt')
const collected: string[] = existsSync(collectedFile)
  ? readFileSync(collectedFile, 'utf-8')
      .split(/\r?\n/gm)
      .filter((str) => str.trim().length > 1)
  : []
function collectLinks(url: string) {
  if (url.endsWith('/')) url = url.replace(/\/$/, '')
  const log = debug(collectLinks.name)
  const elog = debug(collectLinks.name + '-error')
  return new Bluebird((resolveCollect: (urls: string[]) => any) => {
    if (collected.includes(url)) return resolveCollect([])
    collected.push(url)
    if (isValidHttpUrl(url)) {
      let savePath = new URL(url).pathname.replace(
        pathname.replace(/\/$/, ''),
        ''
      )
      // fix no-extension path
      if (!/\.\w+$/.test(savePath)) {
        savePath = `${savePath}/index.html`
      }
      if (!savePath.endsWith('.html')) {
        // non-html extension
        if (/.(png|jpe?g|ico|txt|gif|svg|mp4)$/.test(savePath)) {
          debug('save-path')(
            color.yellowBright('skip non-html file'),
            workspace(savePath)
          )
          return resolveCollect([])
        }

        if (savePath.endsWith('/')) {
          savePath += 'index.html'
        } else {
          savePath += '/index.html'
        }
      }
      savePath = path.join(destDir, savePath)
      debug('save-path')(new URL(url).pathname, '->', workspace(savePath))

      /*
      if (existsSync(savePath)) {
        debug('already')(savePath)
        return resolveCollect([])
      }
      */

      snapshot3(url, function (html) {
        const dom = new JSDOM(html)
        const document = dom.window.document
        // skip when defined meta react-static
        if (document.querySelectorAll('meta[react-static]').length > 0) {
          dom.window.close()
          return resolveCollect([])
        }
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
        debug('total')(internal_links.length + ' links')
        // ext links
        anchors
          .filter(
            (a) => /^https?:\/\//.test(a.href) && !a.href.includes(hostname)
          )
          .forEach((a) => {
            a.rel = 'nofollow noopener noreferer'
            a.target = '_blank'
          })
        const meta = document.createElement('meta')
        meta.name = 'react-static'
        document.head.appendChild(meta)
        const serialized = dom.serialize()

        // save html to dest
        save(savePath, serialized)

        dom.window.close()
        log(url, color.green(String(internal_links.length)))
        const clone = structuredClone(internal_links)
        const iterate = function () {
          return new Bluebird((resolveIt: (urls: string[]) => any) => {
            collectLinks('http://localhost:4000' + clone.shift()).then(
              (newUrls) => {
                if (clone.length > 0) {
                  iterate().then((urls2) => resolveIt(urls2.concat(newUrls)))
                } else {
                  resolveIt(newUrls)
                }
              }
            )
          })
        }
        iterate().then((newUrls) =>
          resolveCollect(array_unique(internal_links.concat(newUrls)))
        )
      })
    } else {
      elog('invalid url', url)
      resolveCollect([])
    }
  })
}

function save(filePath: string, content: string) {
  if (!existsSync(path.dirname(filePath)))
    mkdirSync(path.dirname(filePath), { recursive: true })
  writeFileSync(filePath, content)
}

function exitHandler(
  code: number,
  reason: string
):
  | NodeJS.UnhandledRejectionListener
  | NodeJS.UncaughtExceptionListener
  | NodeJS.ExitListener {
  console.info(reason, 'registered listener code', code)
  return (code: any, reason: any) => (err: any, promise: any) => {
    //console.log(code, reason, err, promise)
    console.info(reason, 'signal received code', code, { err, promise })
    if (collected.length > 0) {
      writeFileSync(collectedFile, array_unique(collected).join('\n'))
    }
  }
}

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
process.on('SIGINT', exitHandler(0, 'SIGINT'))

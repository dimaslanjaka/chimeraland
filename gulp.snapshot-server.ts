/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="node_modules/@types/serve-static/index.d.ts" />
import Bluebird from 'bluebird'
import 'core-js/actual/structured-clone'
import debuglib from 'debug'
import express from 'express'
import { copyFileSync, existsSync } from 'fs'
import { Server } from 'http'
import { join } from 'path'
import path from 'upath'
import { workspace } from './express'
import { Snapshot } from './gulp.snapshot'
import pkg from './package.json'
import { save } from './src/utils/file-node'
import noop from './src/utils/noop'
import { fixUrl } from './src/utils/url'

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

const snap = new Snapshot()
const scrape = (url: string) => {
  snap
    .scrape(url)
    .then((html) => {
      save(join(__dirname, 'tmp/index.html'), html)
    })
    .catch(noop)
    .finally(() => {
      //console.log(snap.links)
    })
}

const done: string[] = []
app.use(async (req, res) => {
  _debugreact(req.path, workspace(index200))
  if (!done.includes(req.path)) {
    done.push(req.path)
    scrape('http://localhost:4000' + req.path)
  }
  return res.sendFile(index200)
})

new Bluebird((resolveServer: (s: Server) => any) => {
  const server = app.listen(4000, () => {
    _debug('listening http://localhost:4000')
  })
  resolveServer(server)
}).then((_server) => {
  const baseUrl = fixUrl('http://localhost:4000/' + pathname)
  scrape(baseUrl)
  /*

  if (_server.closeAllConnections) {
    _server.closeAllConnections()
  } else {
    _server.close()
  }*/
})

import debuglib from 'debug'
import express from 'express'
import { copyFileSync, existsSync } from 'fs'
import { Server } from 'http'
import path, { toUnix } from 'upath'
import pkg from './package.json'

const app = express()
const pathname = new URL(pkg.homepage).pathname
/** React Generated Dir */
const baseDir = path.resolve('./build')
/** HexoJS Generated Dir */
const blogDir = path.resolve('./blog/public')
const _debug = debuglib('chimera-express')
const _debug2 = debuglib('chimera-debug')

const blogIndex = path.join(blogDir, 'index.html')
const index = path.join(__dirname, 'build', 'index.html')
const index200 = path.join(__dirname, 'build', '200.html')
const index404 = path.join(__dirname, 'build', '404.html')
if (!existsSync(index)) throw new Error('index.html not exist in build')
if (!existsSync(index200)) copyFileSync(index, index200)
if (!existsSync(index404)) copyFileSync(index, index404)

function ExpressServer(): Promise<{
  app: express.Express
}>
function ExpressServer(port: string | number): Promise<{
  server: Server
  app: express.Express
}>
/**
 * serve from 200.html
 * @param port
 */
function ExpressServer(port?: string | number) {
  // start serving static files
  app.use(express.static(blogDir))
  app.use(pathname, express.static(blogDir))
  app.use(express.static(baseDir))
  app.use(pathname, express.static(baseDir))

  app.get(pathname, (_, res) => {
    _debug('blog', workspace(blogIndex))
    return res.sendFile(blogIndex)
  })

  const routePath = pathname.endsWith('/') ? pathname + '*' : pathname

  app.all(routePath, function (req, res, next) {
    const currentPath = (
      req.path.endsWith('/') ? req.path + 'index.html' : req.path
    ).replace(pathname, '')
    const blogfile = path.resolve(blogDir, currentPath)
    if (existsSync(blogfile)) {
      _debug('blog', path.extname(blogfile), workspace(blogfile))
      return res.sendFile(blogfile)
    }

    const reactfile = path.resolve(baseDir, currentPath)
    _debug2('react', reactfile, existsSync(reactfile))
    if (existsSync(reactfile)) {
      _debug('react', path.extname(reactfile), workspace(reactfile))
      return res.sendFile(reactfile)
    }

    if (req.accepts('html'))
      if (existsSync(blogIndex)) {
        _debug('fallback', currentPath, '->', workspace(index200))
        return res.sendFile(index200)
      }
    next()
  })

  if (port) {
    const server = app.listen(port, function () {
      console.log('http://localhost:' + port)
    })
    return Promise.resolve({ server, app })
  }
  return Promise.resolve({ app })
}

export default ExpressServer

/**
 * Remove cwd
 * @param str
 * @returns
 */
export function workspace(str: string) {
  return toUnix(str).replace(toUnix(process.cwd()), '')
}

export function ExpressFallback(
  app: express.Express,
  precall?: (req: express.Request, res: express.Response) => any
) {
  // express fallback
  app.use((req, res, next) => {
    if (typeof precall === 'function') precall(req, res)
    if (
      (req.method === 'GET' || req.method === 'HEAD') &&
      req.accepts('html')
    ) {
      //(res.sendFile || res.sendfile).call(res, ...args, (err) => err && next());
      if (!res.headersSent) return res.sendFile(index200)
      next()
    } else {
      next()
    }
  })
}

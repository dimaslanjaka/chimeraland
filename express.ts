import express from 'express'
import { copyFileSync, existsSync } from 'fs'
import { Server } from 'http'
import path from 'path'
import pkg from './package.json'
const app = express()
const pathname = new URL(pkg.homepage).pathname

const index = path.join(__dirname, 'build', 'index.html')
const index200 = path.join(__dirname, 'build', '200.html')
if (!existsSync(index200)) copyFileSync(index, index200)

/**
 * serve from 200.html
 * @param port
 */
function ExpressServer(port: string | number): Promise<Server>
function ExpressServer(
  port: string | number,
  callback: {
    (server: Server): any
  }
): any
/**
 * serve from 200.html
 * @param  callback
 */
function ExpressServer(
  port: string | number,
  callback?: {
    (server: Server): any
  }
) {
  const baseDir = path.resolve('./build')
  app.use(express.static(baseDir))
  app.use(pathname, express.static(baseDir))
  // express fallback
  app.use((req, res, next) => {
    if (
      (req.method === 'GET' || req.method === 'HEAD') &&
      req.accepts('html')
    ) {
      //(res.sendFile || res.sendfile).call(res, ...args, (err) => err && next());
      res.sendFile(index200)
    } else {
      next()
    }
  })

  app.use('/*', function (_req, res, next) {
    if (existsSync(index200)) return res.sendFile(index200)
    next()
  })

  const server = app.listen(port, function () {
    console.log('http://localhost:' + port)
  })
  if (typeof callback === 'function') {
    return callback(server)
  } else {
    return Promise.resolve(server)
  }
}

export default ExpressServer

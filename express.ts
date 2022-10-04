import express from 'express'
import { copyFileSync, existsSync } from 'fs'
import path from 'path'
import pkg from './package.json'
const app = express()
const pathname = new URL(pkg.homepage).pathname

const index = path.join(__dirname, 'build', 'index.html')
const index200 = path.join(__dirname, 'build', '200.html')
const index404 = path.join(__dirname, 'build', '404.html')
if (!existsSync(index)) throw new Error('index.html not exist in build')
if (!existsSync(index200)) copyFileSync(index, index200)
if (!existsSync(index404)) copyFileSync(index, index404)

/**
 * serve from 200.html
 * @param port
 */
function ExpressServer(port: string | number) {
  const baseDir = path.resolve('./build')
  app.use(express.static(baseDir))
  app.use(pathname, express.static(baseDir))
  // express fallback
  /*app.use((req, res, next) => {
    if (
      (req.method === 'GET' || req.method === 'HEAD') &&
      req.accepts('html')
    ) {
      //(res.sendFile || res.sendfile).call(res, ...args, (err) => err && next());
      res.sendFile(index200)
    } else {
      next()
    }
  })*/

  app.get('/', function (_req, res, next) {
    if (existsSync(index200)) return res.sendFile(index200)
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

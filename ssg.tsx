import debuglib from 'debug'
import express from 'express'
import { copyFileSync, existsSync } from 'fs'
import path from 'upath'
import { workspace } from './express'
import pkg from './package.json'

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

const app = express()
app.use(express.static(blogDir))
app.use(pathname, express.static(blogDir))
app.use(express.static(baseDir))
app.use(pathname, express.static(baseDir))

app.get(pathname, (_, res) => {
  _debug('blog', workspace(blogIndex))
  return res.sendFile(blogIndex)
})

app.use('*', async (_, res) => {
  _debug('react', workspace(index200))
  return res.sendFile(index200)
})

app.listen(4000, () => {
  //
})

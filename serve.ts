// serve .deploy_git
import express from 'express'
import { resolve } from 'path'
import pkg from './package.json'

const pathname = new URL(pkg.homepage).pathname
const app = express()
app.use(pathname, express.static(resolve('.deploy_git')))
app.listen(4000, () => {
  //
})

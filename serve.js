const express = require('express')
const { existsSync } = require('fs')
const path = require('path')
const app = express()
const package = require('./package.json')
const pathname = new URL(package.homepage).pathname

app.use(express.static(path.join(__dirname, 'build')))
app.use(pathname, express.static(path.join(__dirname, 'build')))

app.use(function (req, res, next) {
  if (req.accepts('html')) {
    let index = path.join(__dirname, 'build', 'index.html')
    if (!existsSync(index)) index = path.join(__dirname, 'build', '200.html')
    if (existsSync(index)) return res.sendFile(index)
  }
  if (req.accepts('json')) {
    res.json({
      status: 404,
      error: 'Not found'
    })
    return
  }

  // default to plain-text. send()
  res.type('txt').send('404 - Not found')
  return next()
})

const port = 4000
app.listen(port, console.log('http://localhost:' + port))

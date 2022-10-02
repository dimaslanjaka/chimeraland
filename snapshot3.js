const render = require('prerender-chrome-headless')
const fs = require('fs')
const { resolve } = require('path')
if (!fs.existsSync(resolve('./build/200.html')))
  fs.copyFileSync(resolve('./build/index.html'), resolve('./build/200.html'))
function snapshot(url, dest) {
  render(url).then((html) => {
    fs.writeFileSync(dest, html)
  })
}
module.exports = {
  default: snapshot,
  snapshot3: snapshot
}

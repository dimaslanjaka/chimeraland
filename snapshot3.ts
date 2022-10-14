import fs from 'fs'
import { resolve } from 'upath'
import render from './packages/prerender-chrome-headless'

if (!fs.existsSync(resolve('./build/200.html')))
  fs.copyFileSync(resolve('./build/index.html'), resolve('./build/200.html'))

function snapshot(
  url: string,
  dest:
    | fs.PathOrFileDescriptor
    | ((arg0: string | NodeJS.ArrayBufferView) => void)
) {
  render(url).then((html: string | NodeJS.ArrayBufferView) => {
    if (typeof dest === 'string') {
      fs.writeFileSync(dest, html)
    } else if (typeof dest === 'function') {
      dest(html)
    }
  })
}

export default snapshot
export const snapshot3 = snapshot

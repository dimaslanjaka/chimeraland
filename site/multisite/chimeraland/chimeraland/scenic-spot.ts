import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'fs'
import sharp from 'sharp'
import slugify from 'slugify'
import { basename, dirname, extname, join, toUnix } from 'upath'
import { hexoProject } from '../project'
import { capitalizer } from '../src/utils/string'
import { scenicArr } from './star-location'

const publicDir = join(hexoProject, 'source/chimeraland/scenic-spot')
const sourceDir = join(__dirname, 'locations/scenic-spot')
const outputJSON = join(__dirname, '../src/utils/chimeraland-scenic.json')

async function main() {
  const readDir = readdirSync(sourceDir)
    .filter((str) => str !== 'desktop.ini')
    .map((file) => join(sourceDir, file))
  const result: any[] = scenicArr

  while (readDir.length > 0) {
    const target = readDir[0]
    const name = capitalizer(basename(target, extname(target)))
    const filename = slugify(name, {
      lower: true,
      trim: true
    })
    const input = readFileSync(target)
    const outputImg = join(publicDir, filename + '.webp')
    if (!existsSync(dirname(outputImg))) mkdirSync(dirname(outputImg))
    let pathname = outputImg
    ;[
      (toUnix(join(process.cwd(), 'source')),
      toUnix(join(hexoProject, 'source')))
    ].map((str) => {
      pathname = pathname.replace(str, '')
    })

    // console.log({ name, output, pathname })
    result.push({
      pathname,
      name,
      output: outputImg.replace(hexoProject, '<project>')
    })

    if (!existsSync(outputImg)) await sharp(input).webp().toFile(outputImg)
    readDir.shift()
  }

  //result.map()

  writeFileSync(outputJSON, JSON.stringify(result, null, 2))
}

main()

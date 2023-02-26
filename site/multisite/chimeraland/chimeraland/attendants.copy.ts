import Bluebird from 'bluebird'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'fs'
import moment from 'moment-timezone'
import sharp from 'sharp'
import slugify from 'slugify'
import { basename, dirname, extname, join } from 'upath'
import { hexoProject } from '../project'
import attendants from './attendants.json'

const outputJSON = join(__dirname, '../src/utils/chimeraland-attendants.json')
const publicDir = join(hexoProject, 'source/chimeraland')
const inputJSON = join(__dirname, 'attendants.json')
const inputDIR = join(__dirname, 'attendants')

type Extended = (typeof attendants)['data'][number] & {
  images: any[]
  videos: any[]
  pathname: string
  type: 'attendants'
}

/**
 * fix non-indexed data from json and local folder
 * @returns
 */
const fixData = function () {
  return new Bluebird((resolve) => {
    readdirSync(inputDIR)
      .filter((str) => str !== 'desktop.ini')
      .forEach((monsterName) => {
        const index = attendants.data.findIndex(
          (item) =>
            item.name === monsterName ||
            slugify(item.name, { lower: true }) ===
              slugify(monsterName, { lower: true })
        )
        const hasData = index !== -1
        if (!hasData) {
          // process new data
          console.log('adding', monsterName)
          const newItem: Required<(typeof attendants.data)[number]> = {
            name: monsterName,
            datePublished: moment().tz('Asia/Jakarta').format(),
            dateModified: moment()
              .tz('Asia/Jakarta')
              .add(11, 'minutes')
              .format(),
            qty: '',
            buff: [],
            delicacies: []
          }
          attendants.data.push(newItem)
        } else {
          const item = attendants.data[index]
          if (!item.buff) item.buff = []
          if (!item.delicacies) item.delicacies = []
          attendants.data[index] = item
        }
      })

    writeFileSync(inputJSON, JSON.stringify(attendants, null, 2))
    resolve(null)
  })
}

const getData = () => {
  return new Bluebird((resolve) => {
    Bluebird.all(attendants.data as Extended[])
      .map(async (item) => {
        if ('images' in item === false) item.images = []
        if ('videos' in item === false) item.videos = []
        item.type = 'attendants'
        item.pathname =
          '/' +
          [
            'chimeraland',
            item.type,
            slugify(item.name, { lower: true, trim: true }) + '.html'
          ].join('/')
        const imagesDir = join(__dirname, 'attendants', item.name.toLowerCase())
        const type = 'attendants'
        if (existsSync(imagesDir)) {
          const dirs = readdirSync(imagesDir)
            .filter((str) => str !== 'desktop.ini')
            .map((filename) => {
              const outputImgFilename =
                basename(filename, extname(filename)) + '.webp'
              return {
                filename: outputImgFilename,
                folder: imagesDir,
                originalPath: join(imagesDir, filename),
                originalFilename: filename,
                pathname:
                  '/' +
                  [
                    'chimeraland',
                    type,
                    slugify(item.name, { lower: true, trim: true }),
                    outputImgFilename
                  ].join('/')
              }
            })

          const results: typeof dirs = []
          while (dirs.length > 0) {
            const toProcess = dirs[0]
            const inputFile = toProcess.originalPath
            if (existsSync(inputFile)) {
              // copy images
              const input = readFileSync(inputFile)
              const output = join(
                publicDir,
                toProcess.pathname.replace('/chimeraland/', '/')
              )
              if (!existsSync(output)) {
                if (!existsSync(dirname(output)))
                  mkdirSync(dirname(output), { recursive: true })
                await sharp(input).webp().toFile(output)
              }
              results.push(toProcess)
            } else {
              console.log('cannot process', toProcess.originalPath)
            }
            dirs.shift()
          }

          return Object.assign({}, item, { images: results })
        }

        return item
      })
      .then(resolve)
  })
}

fixData().then(() =>
  getData().then((data) => {
    writeFileSync(outputJSON, JSON.stringify(data, null, 2))
    console.log('json written', outputJSON)
  })
)

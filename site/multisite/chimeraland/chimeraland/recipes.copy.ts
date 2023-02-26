import axios from 'axios'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from 'fs-extra'
import sharp from 'sharp'
import slugify from 'slugify'
import { dirname, join } from 'upath'
import { hexoProject } from '../project'
import { array_unique } from '../src/utils/array'
import recipes from './recipes.json'

const publicDir = join(hexoProject, 'source/chimeraland')
const outputJSON = join(__dirname, '../src/utils/chimeraland-recipes.json')
const data = recipes.data
const results: any[] = []

;(async () => {
  while (data.length > 0) {
    const item = data[0]
    const slugname = slugify(item.name, { lower: true, trim: true })
      // remove special char except space, underscore, alphabetic, number
      .replace(/[^a-zA-Z0-9\s+\-_]/g, '')
      // replace whitespaces and underscore with single hypens
      .replace(/[\s\-_]+/g, '-')
      // replace multiple hypens with single hypens
      .replace(/-+/g, '-')
    const localImage = join(__dirname, 'recipes', slugname + '.jpg')
    const info = {}
    const pathname = '/' + join('chimeraland', 'recipes', slugname + '.html')
    if ('buff' in item) item.buff = array_unique(<any>item.buff) as string[]
    if (existsSync(localImage)) {
      const input = readFileSync(localImage)
      const info = {
        filename: slugname + '.webp',
        pathname:
          '/' +
          ['chimeraland', 'recipes', slugname, slugname + '.webp'].join('/'),
        icon: {
          filename: slugname + '-icon.webp',
          pathname:
            '/' +
            ['chimeraland', 'recipes', slugname, slugname + '-icon.webp'].join(
              '/'
            )
        },
        material: {
          filename: slugname + '-material.webp',
          pathname:
            '/' +
            [
              'chimeraland',
              'recipes',
              slugname,
              slugname + '-material.webp'
            ].join('/')
        },
        name: {
          filename: slugname + '-name.webp',
          pathname:
            '/' +
            ['chimeraland', 'recipes', slugname, slugname + '-name.webp'].join(
              '/'
            )
        }
      }

      // copy main image
      const dest_image = joinp(
        publicDir,
        info.pathname.replace(/chimeraland\//, '')
      )

      if (!existsSync(dest_image)) copyFileSync(localImage, dest_image)

      // copy icon image

      const dest_icon = joinp(
        publicDir,
        info.icon.pathname.replace(/chimeraland\//, '')
      )
      //console.log(dest_icon)

      if (!existsSync(dest_icon)) {
        let extract = true
        if ('images' in item) {
          if ('icon' in item.images) {
            extract = false
            try {
              const input = (
                await axios.get(item.images.icon, {
                  responseType: 'arraybuffer'
                })
              ).data as Buffer
              await sharp(input).webp().toFile(dest_icon)
            } catch (_e) {
              //
            }
          }
        }
        if (extract) {
          await sharp(input)
            .extract({
              left: 1150,
              top: 100,
              width: 95,
              height: 90
            })
            .webp()
            .toFile(dest_icon)
        }
      }
      const dest_material = joinp(
        publicDir,
        info.material.pathname.replace(/chimeraland\//, '')
      )
      if (!existsSync(dest_material))
        await sharp(input)
          .extract({
            left: 70,
            top: 180,
            width: 500,
            height: 500
          })
          .webp()
          .toFile(dest_material)
      const dest_name = joinp(
        publicDir,
        info.name.pathname.replace(/chimeraland\//, '')
      )
      if (!existsSync(dest_name))
        await sharp(input)
          .extract({
            left: 1150,
            top: 100,
            width: 255,
            height: 95
          })
          .webp()
          .toFile(dest_name)
      results.push(Object.assign({}, item, { images: info, pathname }))
    } else {
      // console.log('not found', localDir)
      results.push(Object.assign({}, item, { images: info, pathname }))
    }
    data.shift()
  }
  writeFileSync(outputJSON, JSON.stringify(results, null, 2))
})()

function joinp(...str: string[]) {
  const path = join(...str)
  if (!existsSync(dirname(path))) {
    mkdirSync(dirname(path), { recursive: true })
  }
  return path
}

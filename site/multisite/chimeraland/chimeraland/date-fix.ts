import { readFileSync, writeFileSync } from 'fs-extra'
import moment from 'moment-timezone'
import { join } from 'upath'

moment.tz('Asia/Jakarta')

type Chimera = typeof import('./recipes.json') &
  typeof import('./materials.json') &
  typeof import('./monsters.json') &
  typeof import('./attendants.json') &
  typeof import('./monsters-evol.json')

const dateobj = {
  datePublished: moment('2022-01-06T13:56:03.123Z').format(
    `YYYY-MM-DDTHH:mm:ssZ`
  ),
  dateModified: moment().format(`YYYY-MM-DDTHH:mm:ssZ`)
}

;[
  'monsters.json',
  'attendants.json',
  'recipes.json',
  'materials.json',
  'monsters-evol.json'
]
  .map((str) => join(__dirname, str))
  .forEach((file) => {
    const read = readFileSync(file).toString()
    const json = JSON.parse(read) as Chimera
    const modify = json.data.map((item) => {
      const result = Object.assign({}, dateobj, item)
      if ('datePublished' in item === false) return result
      if (
        item.name.includes('Spirit') &&
        !['spirit fox fur'].some((str) => new RegExp(str, 'i').test(item.name))
      ) {
        result.datePublished = moment('2022-04-06T13:56:03.123Z').format(
          `YYYY-MM-DDTHH:mm:ssZ`
        )
        // console.log(item.name)
      }
      return item
    })
    const write = false
    if (write) writeFileSync(file, JSON.stringify({ data: modify }, null, 2))
  })

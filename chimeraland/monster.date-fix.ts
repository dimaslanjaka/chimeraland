import { writeFile } from 'fs'
import moment from 'moment'
import { join } from 'upath'
import monsters from './monsters.json'

const updates: string[] = []
const dates: string[] = []

monsters.data = monsters.data.map((data) => {
  let updated = data.dateModified
  let date = data.datePublished
  while (dates.includes(date)) {
    // add 1 hour to date published
    date = moment(date).add(1, 'hour').format()
    console.log({ date })
  }

  while (updates.includes(updated)) {
    // add 1 hour to updated
    updated = moment(updated).add(1, 'hour').format()
    console.log({ updated })
  }

  updates.push(updated)
  dates.push(date)

  data.datePublished = date
  data.dateModified = updated

  return data
})

writeFile(
  join(__dirname, 'monsters.json'),
  JSON.stringify(monsters, null, 2),
  function (e) {
    if (e instanceof Error) {
      console.log(e.message)
    } else {
      console.log('written succesful')
    }
  }
)

import { writeFileSync } from 'fs'
import { join } from 'upath'
import { MaterialsData, MonstersData, RecipesData } from './chimeraland'

/**
 * run this file standalone
 */

const searchData = RecipesData.concat(<any>MonstersData)
  .concat(<any>MaterialsData)
  .map((item, id) => {
    return Object.assign({ id: id + 1 }, item)
  })
writeFileSync(join(__dirname, 'search.json'), JSON.stringify(searchData))

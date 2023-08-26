import central from './star-locations-central.json'
import east from './star-locations-east.json'
import south from './star-locations-south.json'
import west from './star-locations-west.json'

export const scenicArr = east.concat(central).concat(south).concat(west)
//const outputJSON = join(__dirname, '../utils/chimeraland-star-locations.json')
//writeFileSync(outputJSON, JSON.stringify(merged))

// scenic
// https://docs.google.com/spreadsheets/d/1W-cRToXSeHCiB8tFjC4xurKefsC-_k6PwDzYP_3yzwA/edit#gid=0

import {
  AttendantsData,
  MaterialsData,
  MonstersData,
  RecipesData
} from './src/utils/chimeraland'

export const SSGRoutes = MonstersData.concat(<any>RecipesData)
  .concat(<any>MaterialsData)
  .concat(<any>AttendantsData)
  .map((item) => item.pathname)

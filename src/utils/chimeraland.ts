import materialData from './chimeraland-materials.json'
import monstersData from './chimeraland-monsters.json'
import recipeData from './chimeraland-recipes.json'

export type DataProp = typeof monstersData[number] & {
  pathname: string
  type: string
}
export const MonstersData = monstersData.map((item) => {
  const recipes: typeof recipeData = []
  item.delicacies.forEach((tasty) => {
    const find = recipeData.find((recipe) => recipe.name === tasty)
    if (typeof find !== 'undefined') {
      recipes.push(find)
    }
  })
  return Object.assign({ type: 'monsters' }, item, { recipes })
})

export const RecipesData = recipeData.map((item) => {
  return Object.assign(
    { images: [] as typeof item.images, videos: [] as any[], type: 'recipes' },
    item
  )
})

export const MaterialsData = materialData.map((mat) => {
  return Object.assign({ type: 'materials' }, mat)
})

import { path } from 'sbg-utility'
import { hexoProject } from './project'
import * as src from './src'

async function copy() {
  await src.attendantCopy(path.join(hexoProject, 'source/chimeraland'))
  await src.materialsCopy(
    hexoProject,
    path.join(hexoProject, 'source/chimeraland')
  )
  await src.monstersCopy(path.join(hexoProject, 'source/chimeraland'))
  await src.recipesCopy(path.join(hexoProject, 'source/chimeraland'))
  await src.scenicSpotCopy(
    path.join(hexoProject, 'source/chimeraland/scenic-spot')
  )
}

async function main() {
  await copy()
  await src.createMarkdownMaterial(
    path.join(hexoProject, 'src-posts/chimeraland/materials')
  )
  await src.createMarkdownPets(hexoProject)
  await src.createMarkdownAttendants(hexoProject)
  await src.createMarkdownRecipe(
    path.join(hexoProject, 'src-posts/chimeraland/recipes')
  )
  await src.createMarkdownScenicSpot(
    path.join(hexoProject, 'src-posts/chimeraland/scenic-spot')
  )
  await src.copySrcPost(path.join(hexoProject, 'src-posts/chimeraland'))
  await src.copySource(path.join(hexoProject, 'source/chimeraland'))
}

main()

import { path } from 'sbg-utility'
import { hexoProject } from './project'
import * as src from './src'

async function main() {
  await src.attendantCopy(path.join(hexoProject, 'source/chimeraland'))
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

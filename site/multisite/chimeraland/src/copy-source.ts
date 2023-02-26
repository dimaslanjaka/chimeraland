import GulpClient from 'gulp'
import { join } from 'upath'
import { hexoProject } from '../project'

const sourceFolder = join(__dirname, '../source')
const sourceOutputFolder = join(hexoProject, 'source/chimeraland')

export function copySource() {
  return GulpClient.src(['**/*.*'], { cwd: sourceFolder }).pipe(
    GulpClient.dest(sourceOutputFolder)
  )
}

export default copySource

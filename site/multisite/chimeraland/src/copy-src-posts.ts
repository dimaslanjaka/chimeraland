import color from 'ansi-colors'
import GulpClient from 'gulp'
import { join } from 'upath'
import { hexoProject } from '../project'

const srcPostFolder = join(__dirname, '../src-posts')
const srcPostOutputFolder = join(hexoProject, 'src-posts/chimeraland')

/**
 * copy multisite/chimeraland/src-post
 * @returns
 */
export function copySrcPost() {
  console.log(
    'copy',
    color.yellowBright(srcPostFolder),
    'to',
    color.greenBright(srcPostOutputFolder)
  )
  return GulpClient.src(['**/*.*'], { cwd: srcPostFolder }).pipe(
    GulpClient.dest(srcPostOutputFolder)
  )
}

export default copySrcPost

if (require.main === module) {
  copySrcPost()
}

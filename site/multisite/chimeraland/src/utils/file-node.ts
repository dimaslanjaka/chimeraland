import Bluebird from 'bluebird'
import {
  existsSync,
  mkdirpSync,
  readdirSync,
  Stats,
  statSync,
  writeFileSync
} from 'fs-extra'
import { dirname, join } from 'upath'

/**
 * read dir sync recursive
 * @param folderPath
 * @returns
 */
export function walkDir(folderPath: string) {
  const results: { path: string; filename: string; stat: Stats }[] = []
  readdirSync(folderPath).map((filename) => {
    const path = join(folderPath, filename)
    const stat = statSync(path)
    // console.log(path, stat.isDirectory())
    if (stat.isDirectory()) {
      const reWalk = walkDir(path)
      results.push(...reWalk)
    } else {
      results.push({
        path,
        filename,
        stat
      })
    }
  })
  return results
}

export function save(file: string, content: string) {
  return new Bluebird((resolve: (file: string) => any) => {
    if (!existsSync(dirname(file))) {
      mkdirpSync(dirname(file))
    }
    writeFileSync(file, content)
    resolve(file)
  })
}

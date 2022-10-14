import Bluebird from 'bluebird'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  Stats,
  statSync,
  writeFileSync
} from 'fs'
import { dirname } from 'path'
import { join } from 'upath'

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
    if (stat.isDirectory()) {
      return walkDir(path)
    }
    results.push({
      path,
      filename,
      stat
    })
  })
  return results
}

export function save(file: string, content: string) {
  return new Bluebird((resolve: (file: string) => any) => {
    if (!existsSync(dirname(file)))
      mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, content)
    resolve(file)
  })
}

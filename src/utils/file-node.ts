import { readdirSync, Stats, statSync } from 'fs'
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

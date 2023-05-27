import Bluebird from 'bluebird'
import fs from 'fs'
import git, { spawnAsync } from 'git-command-helper'
import * as glob from 'glob'
import sbgutil from 'sbg-utility'
import { trueCasePathSync } from 'true-case-path'
import path, { basename, join, toUnix } from 'upath'

/** images directory */
const imagesDir = trueCasePathSync(join(__dirname, 'images'))
/** get screenshots using fs.readdirsync */
export const screenshots = function (): Promise<string[]> {
  return new Promise((resolve) => {
    const results: string[] = []

    fs.readdirSync(imagesDir)
      .filter((filePath) => /.(jpe?g|png)$/gi.test(filePath))
      .map((filePath) => join(imagesDir, filePath))
      .map((filePath, index, all) => {
        //https://stackoverflow.com/a/957978
        spawnAsync('git', 'rev-parse --show-toplevel'.split(' ')).then(
          (toplevel) => {
            // https://stackoverflow.com/a/4090938
            spawnAsync('git', 'config --get remote.origin.url'.split(' '), {
              cwd: __dirname
            })
              .then((origin) => {
                spawnAsync('git', 'branch --show-current'.split(' ')).then(
                  (branch) => {
                    const url = new URL(
                      origin.stdout.trim().replace(/(.git|\/)$/i, '')
                    )
                    url.pathname = (
                      url.pathname +
                      '/raw/' +
                      branch.stdout.trim() +
                      '/' +
                      toUnix(
                        trueCasePathSync(filePath).replace(
                          trueCasePathSync(toplevel.stdout.trim()),
                          ''
                        )
                      )
                    ).replace(/\/{2,}/gm, '/')

                    sbgutil.debug('chimera-blacklist')('img', url.toString())

                    const img = `<figure><img src="${url.toString()}" alt="${basename(
                      filePath
                    )}" /><figcaption>${basename(
                      filePath
                    )}</figcaption></figure>`
                    results.push(img)

                    if (index === all.length - 1) {
                      resolve(results.sort(Intl.Collator().compare))
                    }
                  }
                )
              })
              .catch(console.log)
          }
        )

        /*const jpgDataUrlPrefix =
          'data:image/' + extname(path).replace('.', '') + ';base64,'
        const base64 = readFileSync(path, 'base64')
        return `<figure><img src="${jpgDataUrlPrefix}${base64}" alt="${basename(
          path
        )}" /><figcaption>${basename(
          path
        )}</figcaption></figure>`*/
      })
  })
}
/** get screenshots using glob */
export const screenshotsGlob = async function () {
  const gch = new git(__dirname)
  const images = await glob.glob('**/*.{png,jpg,jpeg}', {
    cwd: imagesDir
  })
  const mapObj = Array.from(
    await Bluebird.all(images)
      .map((file) => {
        return {
          absolute: path.join(imagesDir, file),
          file: path.toUnix(file)
        }
      })
      .map(async (o) => {
        return {
          ...o,
          raw: (await gch.getGithubRepoUrl(o.absolute)).rawURL,
          hash: await gch.latestCommit(o.file, { cwd: imagesDir }),
          name: basename(o.file)
        }
      })
  ).sort(function (a, b) {
    return a.name.localeCompare(b.name)
  })
  const mapHtml = mapObj.map((o) => {
    const fn = basename(o.absolute)
    return `<figure><img src="${o.raw.replace(
      '/master/',
      '/' + o.hash + '/'
    )}" alt="${fn}" /><figcaption>${fn}</figcaption></figure>`
  })
  return mapHtml
}

if (require.main === module) {
  screenshotsGlob().then(console.log)
}

// export * from './attendant-list'
// export * from './blacklist-player'
// export * from './material-location'
import { glob } from 'glob'
import { parsePost } from 'hexo-post-parser'
import moment from 'moment-timezone'
import { writefile } from 'sbg-utility'
import { trueCasePathSync } from 'true-case-path'
import path from 'upath'
import {
  AttendantsData,
  MaterialsData,
  MonstersData
} from '../utils/chimeraland'

// create /chimeraland/index.html
const base = path.join(__dirname, '../../src-posts')
let body =
  `
## [Cooking Recipes](/chimeraland/recipes.html)
All in one recipes
`.trim() + '\n\n'
const dates = AttendantsData.concat(
  ...(MonstersData as any[]),
  ...(MaterialsData as any[])
).map((o) => moment(o.dateModified).valueOf())

glob('**/*.md', { cwd: base, realpath: true, absolute: true })
  .then((paths) => {
    const unix_paths = paths.map(path.toUnix)
    const parse = async function () {
      for (let i = 0; i < unix_paths.length; i++) {
        const post_path = unix_paths[i]
        const parsed = await parsePost(post_path)
        const { title, updated } = parsed.metadata
        let { permalink, thumbnail } = parsed.metadata

        // push updated to dates
        dates.push(moment(String(updated)).valueOf())

        // thumbnail fix
        if (!thumbnail || thumbnail.trim().length === 0) {
          thumbnail = `https://via.placeholder.com/200x50/FFFFFF/000000/?text=${title}`
        }

        // permalink fix
        if (!permalink || permalink.trim().length === 0) {
          permalink = path
            .toUnix(
              trueCasePathSync(post_path).replace(
                trueCasePathSync(base),
                '/chimeraland'
              )
            )
            .replace(/.md$/, '.html')
        }
        body +=
          `
## [${title}](${permalink})
![${title}](${thumbnail})
      `.trim() + '\n\n'
      }
    }
    parse().then(function () {
      const updated = moment(Math.max.apply(null, dates))
      const metadata =
        `
---
title: Chimeraland Unofficial Wikipedia
date: 2022-09-10 12:13:30
updated: ${updated.format('YYYY-MM-DDTHH:mm:ssZ')}
type: page
permalink: /chimeraland/index.html
---
    `.trim() + '\n\n'

      const markdown = metadata + body
      writefile(path.join(__dirname, '../../src-posts/index.md'), markdown)
    })
  })
  .finally(function () {
    import('./attendant-list')
    import('./blacklist-player')
    import('./material-location')
  })

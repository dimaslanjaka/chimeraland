// export * from './attendant-list'
// export * from './blacklist-player'
// export * from './material-location'
import { glob } from 'glob'
import { parsePost } from 'hexo-post-parser'
import moment from 'moment-timezone'
import { trueCasePathSync, writefile } from 'sbg-utility'

import path from 'upath'
import { chimeralandProject } from '../../project'
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

export async function buildChimeralandPosts() {
  try {
    const paths = await glob('**/*.md', {
      cwd: base,
      realpath: true,
      absolute: true
    })
    const unix_paths = paths
      .map(path.toUnix)
      .sort((a, b) => a.length - b.length)

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
          thumbnail = `https://via.placeholder.com/700x500/FFFFFF/000000/?text=${title.replace(
            /\s/gim,
            '+'
          )}`
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
    await parse()
    const updated_1 = moment(Math.max.apply(null, dates))
    const metadata =
      `
---
title: Chimeraland Unofficial Wikipedia
date: 2022-09-10 12:13:30
updated: ${updated_1.format('YYYY-MM-DDTHH:mm:ssZ')}
tags: [chimeraland]
categories: [games, chimeraland]
permalink: /chimeraland/index.html
thumbnail: https://www.levelinfinite.com/wp-content/uploads/2022/05/chimeraland_1.jpg
---
    `.trim() + '\n\n'

    const markdown = metadata + body
    writefile(path.join(chimeralandProject, 'src-posts/index.md'), markdown)
  } finally {
    await import('./attendant-list')
    await import('./blacklist-player')
    await import('./material-location')
  }
}

if (require.main === module) {
  // run standalone
  buildChimeralandPosts()
}

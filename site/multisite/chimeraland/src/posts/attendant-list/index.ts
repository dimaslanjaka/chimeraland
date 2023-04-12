import _ from 'lodash'
import path from 'path'
import { writefile } from 'sbg-utility'
import { AttendantsData } from '../../utils/chimeraland'

const body = AttendantsData.map((data) => {
  return `
- [${data.name.replace(/\w+/g, _.capitalize)}](${data.pathname})
  `.trim()
}).join('\n')

const markdown = `
---
title: Chimeraland Attendant List
date: 2023-04-12T13:38:00+0700
updated: 2023-04-12T13:38:00+0700
categories: ['games', 'chimeraland']
tags: ['attendant']
permalink: /chimeraland/attendant-list.html
---

## List attendant chimeraland game

${body}
`

writefile(
  path.join(__dirname, '../../../src-posts/attendant-list.md'),
  markdown
)

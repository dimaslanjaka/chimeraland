import _ from 'lodash'
import moment from 'moment-timezone'
import path from 'path'
import { writefile } from 'sbg-utility'
import { AttendantsData } from '../../utils/chimeraland'

const body = AttendantsData.map((data) => {
  return `
- [${data.name.replace(/\w+/g, _.capitalize)}](${data.pathname})
  `.trim()
}).join('\n')

const dates = AttendantsData.map((data) => moment(data.dateModified).valueOf())
let updated = moment(Math.max.apply(null, dates))
const created = moment('2023-04-12T13:38:00+0700')
const isLatestAttendantValid = updated.diff(created) >= 0
if (!isLatestAttendantValid) updated = moment('2023-04-12T20:38:00+0700')

const markdown = `
---
title: Chimeraland Attendant List
date: 2023-04-12T13:38:00+0700
updated: ${updated.format('YYYY-MM-DDTHH:mm:ssZ')}
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

import git from 'git-command-helper'
import gulp, { TaskFunctionCallback } from 'gulp'
import moment from 'moment'
import { join } from 'path'
import sf from 'safelinkify'
import { getConfig } from 'static-blog-generator'
import through2 from 'through2'

const deployDir = join(__dirname, 'public')
const config = getConfig()
const configSafelink = Object.assign(
  { enable: false },
  config.external_link.safelink
)
const safelink = new sf.safelink({
  // exclude patterns (dont anonymize these patterns)
  exclude: [
    ...config.external_link.exclude,
    /https?:\/\/?(?:([^*]+)\.)?webmanajemen\.com/,
    /([a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?[.])*webmanajemen\.com/,
    new URL(config.url).host,
    'www.webmanajemen.com',
    'https://github.com/dimaslanjaka',
    'https://facebook.com/dimaslanjaka1',
    'dimaslanjaka.github.io',
    ...configSafelink.exclude
  ].filter(function (x, i, a) {
    // remove duplicate
    return a.indexOf(x) === i
  }),
  redirect: [config.external_link.safelink.redirect, configSafelink.redirect],
  password: configSafelink.password || config.external_link.safelink.password,
  type: configSafelink.type || config.external_link.safelink.type
})

// safelinkify the deploy folder
gulp.task('safelink', safelinkProcess)

export function safelinkProcess(_done?: TaskFunctionCallback) {
  return new Promise((resolve) => {
    gulp
      .src(['**/*.{html,htm}'], {
        cwd: deployDir,
        ignore: []
      })
      .pipe(
        through2.obj(async (file, _enc, next) => {
          // drop null
          if (file.isNull()) return next()
          // do safelinkify
          const content = String(file.contents)
          const parsed = await safelink.parse(content)
          if (parsed) {
            file.contents = Buffer.from(parsed)
            return next(null, file)
          }
          console.log('cannot parse', file.path)
          next()
        })
      )
      .pipe(gulp.dest(deployDir))
      .once('end', () => resolve(null))
  })
}

gulp.task('deploy', async function () {
  const github = new git(join(__dirname, 'public'))
  await github.setremote('https://github.com/dimaslanjaka/chimeraland.git')
  await github.setbranch('gh-pages')
  await github.add('-A')
  await github.commit('update chimeraland ' + moment().format())
  await github.push(true)
})

gulp.task('copy', function () {
  return gulp.src(join(__dirname, 'public')).pipe(gulp.dest(join(__dirname, '.deploy_git')))
})
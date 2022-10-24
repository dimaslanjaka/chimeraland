import gulp from 'gulp'
import dom from 'gulp-dom'
import sf from 'safelinkify'
import { getConfig } from 'static-blog-generator'
import { join } from 'upath'

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

export function safelinkProcess(_done?: TaskCallback) {
  return new Promise((resolve) => {
    gulp
      .src(['**/*.{html,htm}'], {
        cwd: deployDir,
        ignore: [
          // skip react project
          '**/chimeraland/{monsters,attendants,recipes,materials,scenic-spots}/**/*.html',
          '**/chimeraland/recipes.html',
          // skip tools
          '**/embed.html',
          '**/tools.html',
          '**/safelink.html'
        ]
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

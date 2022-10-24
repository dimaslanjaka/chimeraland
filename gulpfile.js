const git = require('git-command-helper')
const gulp = require('gulp')
const moment = require('moment')
const { join } = require('path')
const sf = require('safelinkify')
const { getConfig } = require('static-blog-generator')
const through2 = require('through2')

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
gulp.task('safelink', function () {
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
})

// deploy from .deploy_git
gulp.task('deploy', async function () {
  const github = new git(join(__dirname, 'public'))
  await github.setremote('https://github.com/dimaslanjaka/chimeraland.git')
  await github.setbranch('gh-pages')
  await github.add('-A')
  await github.commit('update chimeraland ' + moment().format())
  await github.push(true)
})

// copy public to .deploy_git
gulp.task('copy', function () {
  return gulp
    .src(join(__dirname, 'public/**/*.*'))
    .pipe(gulp.dest(join(__dirname, '.deploy_git')))
})

// compress image from public to .deploy_git
gulp.task('compress', async function () {
  const imagemin = await import('gulp-imagemin')
  const { gifsicle, mozjpeg, optipng, svgo } = await import('gulp-imagemin')
  return gulp
    .src(join(deployDir, '**/*,{jpg,png}'))
    .pipe(
      imagemin([
        gifsicle({ interlaced: true }),
        mozjpeg({ quality: 75, progressive: true }),
        optipng({ optimizationLevel: 5 }),
        svgo({
          plugins: [
            {
              name: 'removeViewBox',
              active: true
            },
            {
              name: 'cleanupIDs',
              active: false
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest(join(__dirname, '.deploy_git')))
})

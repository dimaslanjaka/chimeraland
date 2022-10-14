import Bluebird from 'bluebird'
import { spawn } from 'child_process'
import { copyFileSync, existsSync, rm, writeFileSync } from 'fs'
import ghpages from 'gh-pages'
import { gitHelper } from 'git-command-helper'
import gulp from 'gulp'
import dom from 'gulp-dom'
import moment from 'moment-timezone'
import sf from 'safelinkify'
import { join } from 'upath'
import pkg from './package.json'

const destDir = join(__dirname, '.deploy_git')
// react build generated dir
const baseDir = join(__dirname, 'build')
// hexo build generated dir
const blogDir = join(__dirname, 'blog/public')

// scan external link to safelink from dest dir
gulp.task('safelink', () => {
  const safelink = new sf.safelink({
    // exclude patterns (dont anonymize these patterns)
    exclude: [
      /https?:\/\/?(?:([^*]+)\.)?webmanajemen\.com/,
      /([a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?[.])*webmanajemen\.com/
    ],
    // url redirector
    redirect: 'https://www.webmanajemen.com/page/safelink.html?url=',
    // debug
    verbose: false,
    // encryption type = 'base64' | 'aes'
    type: 'base64',
    // password aes, default = root
    password: 'unique-password'
  })
  const internal_links = [
    'www.webmanajemen.com',
    'https://github.com/dimaslanjaka',
    '/dimaslanjaka1',
    'dimaslanjaka.github.io'
  ]
  return gulp
    .src(
      ['*/*.html', '**/*.html', '**/**/*.html']
        .map((path) => join(destDir, path))
        .concat('!**/tmp/**', '!**/node_modules/**')
    )
    .pipe(
      dom(function () {
        //https://github.com/trygve-lie/gulp-dom
        //this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
        const elements = Array.from(this.querySelectorAll('a'))
        for (let i = 0; i < elements.length; i++) {
          const a = elements[i]
          const href = String(a['href']).trim()
          if (new RegExp('^https?://').test(href)) {
            /**
             * match host
             */
            const matchHost = internal_links.includes(new URL(href).host)
            /**
             * match url internal
             */
            const matchHref = internal_links.includes(href)
            if (!matchHref) {
              a.setAttribute('rel', 'nofollow noopener noreferer')
            }
            if (!matchHost && !matchHref) {
              const safelinkPath = safelink.encodeURL(href)
              if (typeof safelinkPath == 'string' && safelinkPath.length > 0) {
                a.setAttribute('href', safelinkPath)
              }
            }
          }
        }
      })
    )
    .pipe(gulp.dest(destDir))
})

// copy blog and build dir to tmp/build
gulp.task('copy', (done) => {
  return gulp
    .src([join(baseDir, '**/*'), join(blogDir, '**/*')])
    .pipe(gulp.dest(destDir))
    .once('end', () => {
      const nojekyll = join(destDir, '.nojekyll')
      if (!existsSync(nojekyll)) writeFileSync(nojekyll, '')
      const gitAttr = join(destDir, '.gitattributes')
      if (!existsSync(gitAttr))
        copyFileSync(join(__dirname, '.gitattributes'), gitAttr)
      const pkgJson = join(destDir, 'package.json')
      if (existsSync(pkgJson)) {
        const child = spawn('npm', ['install'], { cwd: destDir })
        child.on('exit', () => {
          done()
        })
      }
    })
})

async function setupDeployGit(cb: CallableFunction) {
  const github = new gitHelper(destDir)
  await github.init()
  await github.setremote(pkg.repository.url)
  await github.spawn('git', ['checkout', '--orphan', 'gh-pages'], {
    cwd: destDir
  })
  cb()
}

gulp.task('setup', setupDeployGit)

function deploy() {
  return new Bluebird((resolve) => {
    ghpages.publish(
      destDir,
      {
        branch: 'gh-pages',
        dotfiles: true,
        message: 'update site ' + moment().format('LLL'),
        repo: pkg.repository.url
      },
      () => setupDeployGit(resolve)
    )
  })
}

gulp.task('clean', function (done) {
  rm(destDir, { recursive: true, force: true }, function (err) {
    if (err) console.log(err.message)
    gulp
      .src(join(__dirname, 'bin/*'))
      .pipe(gulp.dest(join(destDir, 'bin')))
      .once('end', () => setupDeployGit(done))
  })
})

gulp.task('deploy', gulp.series('copy', deploy))
gulp.task('clean-deploy', gulp.series('clean', 'copy', deploy))

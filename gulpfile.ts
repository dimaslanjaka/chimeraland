if (!process.env.DEBUG) process.env.DEBUG = 'prerender-it*'
import { spawn } from 'child_process'
import {
  copySync,
  existsSync,
  mkdirSync,
  rmSync,
  statSync,
  writeFileSync
} from 'fs-extra'
import { gitHelper } from 'git-command-helper'
import gulp from 'gulp'
import dom from 'gulp-dom'
import moment from 'moment-timezone'
import { noop } from 'react-prerender-it'
import sf from 'safelinkify'
import through2 from 'through2'
import { join } from 'upath'
import { gulpSnap } from './gulp.snapshot-routes'
import pkg from './package.json'

const destDir = join(__dirname, '.deploy_git')
if (!existsSync(destDir)) mkdirSync(destDir)
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
      if (!existsSync(gitAttr)) {
        copySync(join(__dirname, '.gitattributes'), gitAttr)
      }

      const bin = join(destDir, 'bin')
      if (!existsSync(bin)) {
        copySync(join(__dirname, 'bin'), bin, { overwrite: true })
      }

      const pkgJson = join(destDir, 'package.json')
      if (existsSync(pkgJson)) {
        const child = spawn('npm', ['install'], { cwd: destDir })
        child.on('exit', () => done())
      } else {
        done()
      }
    })
})

async function setupDeploy() {
  const github = new gitHelper(destDir)
  await github.init()
  await github.setremote(pkg.repository.url)
  return github
}

async function deploy(cb?: CallableFunction) {
  const github = await setupDeploy()
  await github
    .spawn('git', ['checkout', '-f', 'gh-pages'], {
      cwd: destDir
    })
    .catch(noop)
  await github
    .spawn('git', ['branch', '-M', 'gh-pages'], {
      cwd: destDir
    })
    .catch(noop)
  await github.add('-A').catch(noop)
  await github.commit('update chimeraland ' + moment().format()).catch(noop)
  await github
    .spawn('git', ['push', '-f', '-u', 'origin', 'gh-pages'], {
      cwd: destDir
    })
    .catch(noop)
  if (typeof cb === 'function') cb()
}

gulp.task('start-deploy', deploy)

gulp.task('clean', function () {
  return gulp
    .src(
      [
        // delete all files and folders
        '**/*'
      ],
      {
        ignore: [
          // keep git files
          '^.git*',
          // keep shortcut script
          '**/bin',
          // keep sitemap
          'sitemap.*',
          // keep CNAME
          'CNAME',
          // keep nojekyll builds
          '.nojekyll',
          // skip removing html, for keep old files on remote
          '**/*.html'
        ],
        cwd: destDir
      }
    )
    .pipe(
      through2.obj((file, _enc, next) => {
        try {
          if (existsSync(file.path)) {
            const { path } = file
            const stats = statSync(path)
            if (stats.isFile()) {
              rmSync(path)
            }
            next(null)
          }
        } catch {
          //
        }
      })
    )
})

gulp.task('snap', gulpSnap)
gulp.task('deploy', gulp.series('snap', 'copy', 'start-deploy'))
gulp.task('clean-deploy', gulp.series('clean', 'snap', 'copy', 'start-deploy'))

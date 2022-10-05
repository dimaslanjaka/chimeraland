import gulp from 'gulp'
import dom from 'gulp-dom'
import sf from 'safelinkify'
import { join } from 'upath'

const destDir = join(__dirname, '.deploy_git')
// react build generated dir
const baseDir = join(__dirname, 'build')
// hexo build generated dir
const blogDir = join(__dirname, 'blog/public')

// scan external link to safelink from dest dir
gulp.task('safelink', async () => {
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
  gulp
    .src(
      ['*/*.html', '**/*.html', '**/**/*.html'].map((path) =>
        join(destDir, path)
      )
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
    .pipe(gulp.dest(join(__dirname, destDir)))
})

// copy blog and build dir to tmp/build
gulp.task('copy', async () => {
  gulp
    .src([join(blogDir, '**/*'), join(baseDir, '**/*')])
    .pipe(gulp.dest(destDir))
})

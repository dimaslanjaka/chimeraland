import gulp from 'gulp'
import dom from 'gulp-dom'
import sf from 'safelinkify'
import { getConfig } from 'static-blog-generator'
import { join } from 'upath'

gulp.task('safelink', async () => {
  const config = getConfig()
  const configSafelink = Object.assign(
    { enable: false },
    config.external_link.safelink
  )
  const safelink = new sf.safelink({
    redirect: [config.external_link.safelink.redirect],
    password: config.external_link.safelink.password,
    type: config.external_link.safelink.type
  })
  const internal_links = [
    ...config.external_link.exclude,
    new URL(config.url).host,
    'www.webmanajemen.com',
    'https://github.com/dimaslanjaka',
    '/dimaslanjaka1',
    'dimaslanjaka.github.io'
  ]
  gulp
    .src(
      ['*/*.html', '**/*.html', '**/**/*.html'].map((path) =>
        join(__dirname, config.public_dir, path)
      )
    )
    .pipe(
      dom(function () {
        //https://github.com/trygve-lie/gulp-dom
        //this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
        const elements = Array.from(this.querySelectorAll('a'))
        if (configSafelink.enable) {
          for (let i = 0; i < elements.length; i++) {
            const a = elements[i]
            const href = String(a['href']).trim()
            if (new RegExp('^https?://').test(href)) {
              /**
               * match host
               */
              const matchHost = internal_links.includes(new URL(href).host)
              /**
               * match url
               */
              const matchHref = internal_links.includes(href)
              if (!matchHost && !matchHref) {
                const safelinkPath = safelink.encodeURL(href)
                if (
                  typeof safelinkPath == 'string' &&
                  safelinkPath.length > 0
                ) {
                  a.setAttribute('href', safelinkPath)
                }
              }
            }
          }
        }
      })
    )
    .pipe(gulp.dest(join(__dirname, config.public_dir)))
})

const { statSync, writeFileSync } = require('fs-extra')
const GulpClient = require('gulp')
const through2 = require('through2')
const moment = require('moment-timezone')
const { join, toUnix } = require('upath')

// only run this script on termux

const info = []

GulpClient.src([__dirname + '/**/*.{jpg,jpeg,png,webp}'], {
  ignore: ['**/node_modules/**', '**/tmp/**', '**/.vscode/**', '**/tmp/**']
}).pipe(
  through2.obj((file, _enc, callback) => {
    if (!file.isDirectory()) {
      const stats = statSync(file.path)
      // mtime = modified date
      // atime = last accessed date
      // birthtime = create date

      const modified = moment(stats.mtimeMs).tz('Asia/Jakarta').format()
      const created = moment(
        stats.birthtimeMs === 0 ? stats.mtimeMs : stats.birthtimeMs
      )
        .tz('Asia/Jakarta')
        .format()
      const obj = {
        filename: file.basename,
        dirname: removeCwd(file.dirname),
        path: removeCwd(file.path),
        created,
        modified
      }
      info.push(obj)
      writeFileSync(join(__dirname, 'info.json'), JSON.stringify(info, null, 2))
    }
    callback()
  })
)

function removeCwd(str) {
  return toUnix(str).replace(join(__dirname, '..'), '')
}

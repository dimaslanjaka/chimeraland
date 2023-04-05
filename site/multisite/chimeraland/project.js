const { join, toUnix } = require('upath')
const spawn = require('cross-spawn')

const hexoProject = join(__dirname, '../../')
const chimeralandProject = toUnix(__dirname)

/**
 * run post:copy
 */
function copyPost() {
  // console.log('npm run copy on', hexoProject)
  spawn('yarn', ['workspace', 'wmi', 'run', 'post:copy'], {
    cwd: hexoProject,
    stdio: 'inherit',
    shell: true
  })
}

/**
 * run build
 */
function generateSite() {
  console.log('npm run build on', hexoProject)
  spawn('npm', ['run', 'build'], {
    cwd: hexoProject,
    stdio: 'inherit',
    shell: true
  })
}

module.exports = {
  hexoProject,
  chimeralandProject,
  generateSite,
  copyPost
}

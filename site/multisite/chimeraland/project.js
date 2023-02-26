const { join, toUnix } = require('upath')
const spawn = require('cross-spawn')

const hexoProject = join(__dirname, '../../')
const chimeralandProject = toUnix(__dirname)

function copyPost() {
  console.log('npm run copy on', hexoProject)
  spawn('npm', ['run', 'copy'], { cwd: hexoProject, stdio: 'inherit', shell: true })
}

function generateSite() {
  console.log('npm run build on', hexoProject)
  spawn('npm', ['run', 'build'], { cwd: hexoProject, stdio: 'inherit', shell: true })
}

module.exports = {
  hexoProject,
  chimeralandProject,
  generateSite,
  copyPost
}

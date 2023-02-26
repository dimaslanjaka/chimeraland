const spawn = require('cross-spawn')
const { hexoProject } = require('../project')

console.log('npm run copy on', hexoProject)
spawn('npm', ['run', 'copy'], { cwd: hexoProject, stdio: 'inherit' })

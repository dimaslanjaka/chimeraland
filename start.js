require('ts-node').register();
const { spawn } = require('cross-spawn');
const project = require('./project');
const copySrcPost = require('./src/copy-src-posts').default;
const copySource = require('./src/copy-source').default;

copySrcPost().on('end', function () {
  copySource().on('end', function () {
    console.log('npm start on', project.hexoProject);
    spawn('npm', ['start'], { cwd: project.hexoProject, stdio: 'inherit' });
  });
});

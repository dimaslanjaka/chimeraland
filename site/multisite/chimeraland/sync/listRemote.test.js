const { listRemote } = require('./listRemote')

listRemote('chimeraland').then(function (list) {
  list.files.forEach(console.log)
})

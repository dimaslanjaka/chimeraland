const { listLocal } = require('./listLocal')
const { listRemote } = require('./listRemote')

const local = listLocal('chimeraland')
const remote = listRemote('chimeraland')

Promise.all([local, remote]).then((values) => {
  const local = values[0]
  const remote = values[1]
  console.log({ remote })
  local.forEach((path) => {
    console.log(path.split('/'))
  })
})

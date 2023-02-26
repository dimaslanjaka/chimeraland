const fs = require('fs').promises
const minimatch = require('minimatch')
const path = require('path/posix')
const { ignores } = require('./_globals')

/**
 * list local files
 * @param {string} localPath
 * @returns {Promise<string[]>}
 */
async function listLocal(localPath) {
  try {
    await fs.access(localPath)
  } catch (e) {
    //directory does not even exist yet
    return []
  }

  let files = []

  const dirFiles = await fs.readdir(localPath)
  for (let i = 0; i < dirFiles.length; i++) {
    const fullPath = path.join(localPath, dirFiles[i])
    const isFolder = (await fs.stat(fullPath)).isDirectory()

    if (isFolder) {
      files = files.concat(await listLocal(fullPath))
    } else {
      files.push(fullPath)
    }
  }

  return files.filter((file) => {
    return ignores.some(
      (pattern) => !minimatch(file, pattern, { dot: true, matchBase: true })
    )
  })
}

module.exports = {
  listLocal
}

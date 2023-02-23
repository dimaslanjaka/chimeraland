'use strict'

const sass = require('node-sass')
const { deepmerge } = 'deepmerge-ts'

module.exports = (ext) =>
  function (data) {
    // support global and theme-specific config
    var userConfig = deepmerge(
      this.theme.config.node_sass || {},
      this.config.node_sass || {}
    )

    var config = deepmerge(
      {
        data: data.text,
        file: data.path,
        outputStyle: 'nested',
        sourceComments: false,
        indentedSyntax: ext === 'sass'
      },
      userConfig
    )

    try {
      // node-sass result object:
      // https://github.com/sass/node-sass#result-object
      const result = sass.renderSync(config)
      // result is now Buffer instead of String
      // https://github.com/sass/node-sass/issues/711
      return result.css.toString()
    } catch (error) {
      console.error(error.toString())
      throw error
    }
  }

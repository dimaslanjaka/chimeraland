const { run } = require('react-snap');
const fs = require('fs');

run({
  source: 'build',
  port: 4000,
  fs,
  minifyHtml: {
    collapseWhitespace: false,
    removeComments: false
  },
  include: ['/sitemap', '/monsters', '/recipes', '/attendants', '/scenic-spots']
}).catch(console.log);

/*
const materials = require('./src/utils/chimeraland-materials.json')
const monsters = require('./src/utils/chimeraland-materials.json')
const recipes = require('./src/utils/chimeraland-materials.json')

// run react-scripts build first

const routes = () => {
  return ['/sitemap']
    .concat(gpathname(monsters))
    .concat(gpathname(materials))
    .concat(gpathname(recipes))
}

run({
  source: 'build',
  port: 4000,
  fs,
  minifyHtml: {
    collapseWhitespace: false,
    removeComments: false
  },
  include: routes()
}).catch(console.log)

function gpathname(o) {
  return o.map((item) => {
    return item.pathname
  })
}
*/

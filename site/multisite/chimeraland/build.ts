import './src'
import copySource from './src/copy-source'
import copySrcPost from './src/copy-src-posts'

copySrcPost().on('end', function () {
  copySource()
})

import { readdirSync } from 'fs'
import { parsePost } from 'hexo-post-parser'
import { join } from 'path'

const dir = join(__dirname, '../src-posts')
const posts = readdirSync(dir).map((file) => join(dir, file))
parsePost(posts[0], { cache: false }).then(console.log)

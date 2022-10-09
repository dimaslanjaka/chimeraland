import express from 'express'
import { join } from 'path'
import snapshot3 from './snapshot3'

const app = express()

snapshot3(
  'http://localhost:4000/chimeraland/monsters/white-maiden.html',
  join(__dirname, 'tmp/snapshot3.html')
)

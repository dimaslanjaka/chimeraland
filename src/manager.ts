import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'upath'
import { MonstersData } from './utils/chimeraland'

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, 'chimeraland')))

app.get('/monsters', function (_, res) {
  res.json(MonstersData)
})

http.createServer(app).listen(4000)
console.log('server running on http://localhost:4000')

require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const cors = require('cors')
const port = 3001

app.use(cors({
  origin: 'http://localhost:3000',
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true, }))

app.use((req, res, next) => {
  console.log(req.originalUrl)
  next()
})
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Mongoose API' })
})


//-------------crud--------------

app.get('/nodes',db.getNodes)
app.post('/nodes',db.createNode)
app.post('/nodes/:parentId/nodes',db.createNode)



app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


const express = require("express")
const app = express()
const port = 3000
const processRequest = require("./process-request.js")
const cors = require('cors')
const bodyParser = require('body-parser')

if (process.env.NODE_ENV === 'development') {
  app.use(cors())
} else {
  app.use(cors({ origin: ["https://www.archiveforever.xyz", "https://archiveforever.xyz"] }))
}

app.use(bodyParser.json({
  limit: '100mb'
}))

app.use(bodyParser.urlencoded({
  limit: '100mb',
  parameterLimit: 100000,
  extended: true
}))

app.get('/', (req, res) => {
  res.send("Hello from the Archive Forever API. Please support this project by sending ETH, Matic, or stablecoins to 0xf59B3Cd80021b77c43EA011356567095C4E45b0e ")
})

app.post('/process-request', (req, res) => {
  processRequest(req, res)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World! this for multi port')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`This is from github and local`)
  console.log(`This is from git change`)
})
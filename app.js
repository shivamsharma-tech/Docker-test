const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World! this for multi port which is run on 3000 and 8080 ')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`This is from github and local`)
  console.log(`This is from git change`)
})
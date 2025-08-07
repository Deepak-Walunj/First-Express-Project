const express = require('express')
const app = new express()
const port = 8080
let server = app.listen(port, () => {
    console.log(`Listening at port: ${port}`)
})
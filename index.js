const express = require('express')
const app = new express()
const {PORT} = require("./settings")
require('./deps')(app);

app.listen(PORT, () => {
    console.log(`Listening at port: ${PORT}`)
})
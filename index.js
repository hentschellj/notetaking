const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const noteRoutes = require('./notes/routes')
const userRoutes = require('./users/routes')

const app = express()
const PORT = process.env.PORT || 4000

const { username, password } = process.env

mongoose.connect(`mongodb://${username}:${password}@ds251112.mlab.com:51112/notetaking`);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/notes', noteRoutes)
app.use('/users', userRoutes)
app.listen(PORT, ()=>{
  console.log(`The app is running on http://localhost:${PORT}`)
})
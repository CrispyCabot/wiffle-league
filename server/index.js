const axios = require('axios')
const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const cors = require("cors")

app.use(cors())
app.use(bodyParser.json({ limit: '1000mb' }))
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: false }))

// Mongoose methods
const uri = `mongodb+srv://admin:${encodeURI(process.env.MONGO_ATLAS_PASSWORD)}@cluster0.kktwa.mongodb.net/${encodeURI(process.env.MONGO_ATLAS_DB)}?retryWrites=true&w=majority`
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (error) {
  if (error)
    console.log(error)
  else
    console.log('Connected to DB')
})

// Express endpoints setup
const PORT = process.env.PORT || 3000
app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) })
app.use(express.static('server_html'))
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

// Default route to log when connected to db
app.get('/', (req, res) => {
  console.log('Route / recieved')
  res.send('Connected')
})

// Routes
const router = express.Router();
const getters = require("./routes/getters");
const setters = require("./routes/setters");

app.use(router.use('/', getters))
app.use(router.use('/', setters))
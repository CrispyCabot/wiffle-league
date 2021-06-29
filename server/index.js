const cookieParser = require('cookie-parser');
const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const cors = require("cors")
require('dotenv').config()


const allowedOrigins = ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://localhost:8081', 'http://wiffle.ninja', 'https://wiffle.ninja', 'http://mock.wiffle.ninja', 'https://mock.wiffle.ninja']
app.use(cors({
  origin: [...allowedOrigins],
  credentials: true
}))
app.use(bodyParser.json({ limit: '1000mb' }))
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: false }))
app.use(cookieParser()); // process.env.COOKIE_SECRET set secret as env var
app.use(express.json());

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
app.listen(PORT, () => { 
  console.log(`Listening on port ${PORT}`)
})
app.use(express.static('server_html'))
app.use(function (req, res, next) {
  // Request methods you wish to allow
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader("Access-Control-Allow-Headers", "*")
  res.setHeader('Access-Control-Allow-Credentials', true)
  // Pass to next layer of middleware
  next()
})

// Default route to log when connected to db
app.get('/', (req, res) => {
  console.log('Route / recieved')
  res.send('Connected')
})

let listeningPlayers = []
app.ws('/:id?', function(ws, req) {
  const senderId = req.params.id
  if (!listeningPlayers.includes(p => p.senderId == senderId)) {
    listeningPlayers.push({ ws, senderId })
  }

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message)
    if (parsedMessage.leaving) {
      listeningPlayers = listeningPlayers.filter(p => p.senderId != parsedMessage.senderId)
      return
    }
    const { notification, key, playerId } = parsedMessage
    const listeningPlayer = listeningPlayers.find(p => p.senderId == playerId)
    listeningPlayer.ws.send(JSON.stringify({ notification, key }))
  });
});

// Routes
const router = express.Router();
const getters = require("./routes/getters");
const setters = require("./routes/setters");
const mutators = require("./routes/mutators");
app.use(router.use('/', getters))
app.use(router.use('/', setters))
app.use(router.use('/', mutators))

const mock_getters = require("./routes/mock-routes/getters");
const mock_setters = require("./routes/mock-routes/setters");
const mock_mutators = require("./routes/mock-routes/mutators");
app.use(router.use('/', mock_getters))
app.use(router.use('/', mock_setters))
app.use(router.use('/', mock_mutators))
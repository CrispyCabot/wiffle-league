const router = require("express").Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { createAccessToken, createJRTEM, sendRefreshToken } = require('./utils/authorization');

// League Setters
const Leagues = require('../models/league-model')

// Player Setters
const Players = require('../models/player-model')
router.route('/players/create').post(async (req, res) => {
  const { email, password, fname, lname, nname, phone, gender } = req.body
  const hashedPassword = await bcrypt.hash(String(password), Number(process.env.SALT_ROUNDS))
  const doesPlayerEmailExist = await Players.exists({email: email})
  if (!doesPlayerEmailExist) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidEmail = re.test(String(email).toLowerCase())
    if (!isValidEmail) {
      res.json({player: response, status: 400, message: 'Invalid Email'})
    } else {
      const accessToken = createAccessToken(playerWithEmail)
      sendRefreshToken(req, res, createJRTEM(playerWithEmail))
      const player = await Players.create({
          email: email,
          password: hashedPassword,
          firstname: fname,
          lastname: lname,
          nickname: nname,
          phone_number: phone,
          gender: gender,
          player_stats: {},
          show_information: false,
          league_ids: []
        })
      res.json({player: player, accessToken: accessToken, status: 200, message: 'Successfully been made an account'})
    }
  } else {
    res.json({status: 400, message: 'This email is already in use'})
  }
})
router.route('/players/login').post(async (req, res) => {
  const { email, password } = req.body
  const doesPlayerEmailExist = await Players.exists({email: email})
  if (doesPlayerEmailExist) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidEmail = re.test(String(email).toLowerCase())
    if (!isValidEmail) {
      res.json({player: response, status: 400, message: 'Invalid Email'})
    } else {
      const playerWithEmail = await Players.findOne({ email: email })
      const passwordMatches = await bcrypt.compare(password, playerWithEmail.password)
      if (passwordMatches) {
        const accessToken = createAccessToken(playerWithEmail)
        sendRefreshToken(req, res, createJRTEM(playerWithEmail))
        res.json({player: playerWithEmail, accessToken: accessToken, status: 200, message: 'Successfully logged into account'})
      } else {
        res.json({status: 400, message: 'Incorrect password'})
      }
    }
  } else {
    res.json({status: 400, message: 'No account with this email'})
  }
})
router.route('/players/logout').post(async (req, res) => {
  sendRefreshToken(req, res, '')
  res.send({
    status: 200,
    message: 'successful logout'
  })
})

// Game Setters

// Auth Setters
router.route('/refresh_token').post((req, res) => {
  const token = req.cookies.jrtem
  if (!token) return res.send({ ok: false, accessToken: '' })

  let decodedPayload = null;
  try {
    decodedPayload = jwt.verify(token, process.env.JRTEM_KEY)
    console.log('is rt valid', decodedPayload)
  } catch(err) {
    console.log(err)
    return res.send({ ok: false, accessToken: '' })
  }

  
  // token is valid
  // we can send back an access token
  // if we ever need to revoke a users refresh token (i.e. their account was hacked)
  // simply go to db token_version column for that user and increment the integer
  Players.findOne({_id: decodedPayload.userId}).then(user => {
    if (!user || user.token_version !== decodedPayload.tokenVersion) return res.send({ ok: false, accessToken: '' });
    sendRefreshToken(req, res, createJRTEM(user))
    res.send({ ok: true, accessToken: createAccessToken(user), user: user })
  })
})

module.exports = router
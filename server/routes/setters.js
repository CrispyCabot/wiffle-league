const router = require("express").Router();
const bcrypt = require('bcrypt')

// League Setters
// const Leagues = require('../models/league-model')

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
      const response = await Players.create({
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
      res.json({player: response, status: 200, message: 'Successfully been made an account'})
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
        res.json({player: playerWithEmail, status: 200, message: 'Successfully logged into account'})
      } else {
        res.json({status: 400, message: 'Incorrect password'})
      }
    }
  } else {
    res.json({status: 400, message: 'No account with this email'})
  }
})

// Game Setters

module.exports = router
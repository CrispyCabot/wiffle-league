const router = require("express").Router();
const bcrypt = require('bcrypt')

// League Setters
// const Leagues = require('../models/league-model')

// Player Setters
const Players = require('../models/player-model')
router.route('/players/create').post(async (req, res) => {
  const { email, password, fname, lname, nname, phone, gender } = req.body
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))

  const doesPlayerEmailExist = await Players.exists({email: email})

  if (!doesPlayerEmailExist) {
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
  } else {
    res.json({status: 400, message: 'This email is already in use'})
  }

})

// Game Setters

module.exports = router
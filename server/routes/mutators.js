const router = require("express").Router();
const bcrypt = require('bcrypt')

// League Getters
const Leagues = require('../models/league-model')

// Player Getters
const Players = require('../models/player-model')
router.route('/players/update-profile').put(async (req, res) => {
  const { playerId, updates } = req.body
  let updatedPlayer = false

  // Hash password if password is present on updates
  if (updates.password && updates.password == updates.confirm_password) {
    updates.password = await bcrypt.hash(String(updates.password), Number(process.env.SALT_ROUNDS))
    delete updates.confirm_password;
  } else {
    delete updates.password;
    delete updates.confirm_password;
  }

  // Make sure new email is not already in use
  if (updates.email) {
    const doesPlayerEmailExist = await Players.exists({email: updates.email})
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidEmail = re.test(String(updates.email).toLowerCase())
    if (doesPlayerEmailExist) {
      res.send({ status: 400, message: 'This email is already in use' })
      return
    } else if (!isValidEmail) {
      res.send({ status: 400, message: 'This email is invalid' })
      return
    }
  }

  // Make sure updates does not have unmutable fields
  const preUpdatePlayer = await Players.findOne({_id: playerId})
  const immutableFields = [ '_id', 'token_version', 'league_ids', 'player_stats' ]
  const presentImmutableFields = immutableFields.map(f => updates[f]).filter(f => f)
  if (presentImmutableFields.length > 0) {
    if (presentImmutableFields.filter(f => updates[f] != preUpdatePlayer[f]).length > 0) {
      res.send({ status: 400, message: 'Some fields being updated are immutable' })
      return
    } else {
      await Players.findOneAndUpdate({_id: playerId}, { ...updates })
      updatedPlayer = await Players.findOne({_id: playerId})
    }
  } else {
    await Players.findOneAndUpdate({_id: playerId}, { ...updates })
    updatedPlayer = await Players.findOne({_id: playerId})
  }

  if (updatedPlayer) {
    res.send({ status: 200, message: 'Player has successfully been updated', player: updatedPlayer })
  } else {
    res.send({ status: 400, message: 'Player has unsuccessfully been updated' })
  }

})

// Game Getters

module.exports = router
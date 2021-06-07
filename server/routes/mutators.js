const router = require("express").Router();
const bcrypt = require('bcrypt');
const authChecker = require("./utils/auth-checker");

// League Getters
const Leagues = require('../models/league-model')

// Player Getters
const Players = require('../models/player-model');
router.route('/players/update-profile').put(authChecker, async (req, res) => {
  const { playerId, updates } = req.body
  const preUpdatePlayer = await Players.findOne({_id: playerId})
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
    if (doesPlayerEmailExist && updates.email != preUpdatePlayer.email) {
      res.send({ status: 400, message: 'This email is already in use' })
      return
    } else if (!isValidEmail) {
      res.send({ status: 400, message: 'This email is invalid' })
      return
    }
  }

  // Make sure updates does not have unmutable fields
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
router.route('/players/:id/selected-schedules/add').put(async (req, res) => {
  const playerId = req.params.id
  const leagueId = req.body.id
  await Players.findOneAndUpdate({_id: playerId}, { $addToSet: { selected_league_schedules: leagueId } })
  const player = await Players.findOne({_id: playerId})
  
  if (player) {
    const allLeagues = await Leagues.find({})
    if (player.selected_league_schedules.length == allLeagues.length && !player.selected_league_schedules.includes('All')) {
      await Players.findOneAndUpdate({_id: playerId}, { $addToSet: { selected_league_schedules: 'All' } })
      const playerAddAllSelected = await Players.findOne({_id: playerId})
      if (playerAddAllSelected) {
        res.send({status: 200, player: playerAddAllSelected})
      } else {
        res.send({status: 400 })
      }
    } else {
      res.send({status: 200, player: player})
    }
  } else {
    res.send({status: 400 })
  }
})
router.route('/players/:id/selected-schedules/remove').put(async (req, res) => {
  const playerId = req.params.id
  const leagueId = req.body.id
  await Players.findOneAndUpdate({_id: playerId}, { $pull: { selected_league_schedules: leagueId } })
  const player = await Players.findOne({_id: playerId})

  if (player) {
    if (player.selected_league_schedules.length == 1 && player.selected_league_schedules[0] == 'All') {
      await Players.findOneAndUpdate({_id: playerId}, { $pull: { selected_league_schedules: 'All' } })
      const playerNoSelected = await Players.findOne({_id: playerId})
      if (playerNoSelected) {
        res.send({status: 200, player: playerNoSelected})
      } else {
        res.send({ status: 400 })
      }
    } else {
      res.send({status: 200, player: player})
    }
  } else {
    res.send({ status: 400 })
  }
})

// Game Getters

module.exports = router
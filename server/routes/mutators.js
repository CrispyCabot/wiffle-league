const router = require("express").Router();
const bcrypt = require('bcrypt');
const authChecker = require("./utils/auth-checker");

// League Getters
const Leagues = require('../models/league-model')
router.route('/leagues/kick-player').put(authChecker, async (req, res) => {
  const { playerId, leagueId } = req.body

  const league = await Leagues.findOne({_id: leagueId})
  if (!league) {
    res.send({ status: 400, message: 'Could not find league'})
  }

  // Make sure player id is in league
  const playerIsInLeague = league.player_ids.includes(playerId)
  // Make sure player being removed isnt the creator
  const playerIsNotTheCreator = league.league_creator_id != playerId

  if (!playerIsInLeague) {
    res.send({ status: 400, message: 'Player is not in the league'})
  } else if (!playerIsNotTheCreator) {
    res.send({ status: 400, message: 'Cannot kick the creator'})
  } else {
    // Remove player id from league
    await Leagues.findOneAndUpdate({_id: leagueId}, { $set: { player_ids: league.player_ids.filter(id => id != playerId) } })
    // Remove league id from player
    await Players.findOneAndUpdate({_id: playerId}, { $pull: { league_ids: leagueId } })
    // TODO
    // Should also send a notification?

    const updatedLeague = await Leagues.findOne({_id: leagueId})
    if (updatedLeague) {
      res.send({ status: 200, message: 'Player successfully kicked', league: updatedLeague})
    } else { 
      res.send({ status: 400, message: 'Player unsuccessfully kicked' })
    }
  }
  
})
router.route('/leagues/edit-settings').put(authChecker, async (req, res) => {
  const { leagueId, name, max_num_players, num_games, team_size, start_date, end_date, deadline_date, about_text, gender } = req.body

  const league = await Leagues.findOne({_id: leagueId})
  if (!league) {
    res.send({ status: 400, message: 'Could not find league'})
  } else {
    // Update league fields
    await Leagues.findOneAndUpdate({_id: leagueId}, {
      $set: {
        name, max_num_players, num_games, team_size, start_date, end_date, deadline_date, about_text, gender
      }
     })

    const updatedLeague = await Leagues.findOne({_id: leagueId})
    if (updatedLeague) {
      res.send({ status: 200, message: 'Successfully updated league settings', league: updatedLeague})
    } else { 
      res.send({ status: 400, message: 'Unsuccessfully updated league settings' })
    }
  }
  
})

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
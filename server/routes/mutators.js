const router = require("express").Router();
const bcrypt = require('bcrypt');
const authChecker = require("./utils/auth-checker");
const gameScoreCalculation = require("./utils/game-score-calculation");
const sendNotification = require("./utils/send-notification");
const deleteNotification = require('./utils/delete-notification');
const defaultStats = require('./utils/default-stats');

// League Mutators
const Leagues = require('../models/league-model')
router.route('/leagues/kick-player').put(authChecker, async (req, res) => {
  const { playerId, leagueId } = req.body

  const league = await Leagues.findOne({_id: leagueId})
  if (!league) {
    res.send({ status: 400, message: 'Could not find this league...'})
  }

  // Make sure player id is in league
  const playerIsInLeague = league.player_ids.includes(playerId)
  // Make sure player being removed isnt the creator
  const playerIsNotTheCreator = league.league_creator_id != playerId

  if (!playerIsInLeague) {
    res.send({ status: 400, message: 'Player is not in this league...'})
  } else if (!playerIsNotTheCreator) {
    res.send({ status: 403, message: 'The creator of the league cannot be kicked'})
  } else {
    // Remove player id from league
    await Leagues.findOneAndUpdate({_id: leagueId}, { $pull: { player_ids: playerId } })
    // Remove league id from player
    await Players.findOneAndUpdate({_id: playerId}, { $pull: { league_ids: leagueId } })
    const notification = { senderId: league.league_creator_id, leagueId: leagueId, gameId: '', message: 'You have been kicked', type: 'LeagueUpdate' }
    await sendNotification(playerId, notification, 'league_updates')
    const updatedLeague = await Leagues.findOne({_id: leagueId})
    if (updatedLeague) {
      res.send({ status: 200, message: 'Player has been successfully kicked', league: updatedLeague})
    } else { 
      res.send({ status: 400, message: 'Player has been unsuccessfully kicked' })
    }
  }
  
})
router.route('/leagues/add-player').put(authChecker, async (req, res) => {
  const { playerId, senderId, leagueId } = req.body

  const league = await Leagues.findOne({_id: leagueId})
  if (!league) {
    res.status(400).send({ status: 400, message: 'Could not find league'})
  } else if (league.league_creator_id != playerId) {
    res.status(400).send({ status: 400, message: 'Player making request is not the creator of this league'})
  }

  // Check if player id is in league
  const playerIsInLeague = league.player_ids.includes(senderId)
  if (playerIsInLeague) {
    res.status(400).send({ status: 400, message: 'Player is already in the league'})
  } else {
    // Remove player id from league
    await Leagues.findOneAndUpdate({_id: leagueId}, { $push: { player_ids: senderId } })
    // Add player stats for new player in league
    await Leagues.findOneAndUpdate({_id: leagueId}, { $addToSet: { player_stats: { player_id: senderId, stats: defaultStats } } })
    // Add league id to players league ids
    await Players.findOneAndUpdate({_id: senderId}, { $addToSet: { league_ids: leagueId } })
    const updatedLeague = await Leagues.findOne({_id: leagueId})
    const updatedPlayer = await Players.findOne({_id: playerId})

    const notification = { senderId: league.league_creator_id, leagueId: leagueId, gameId: '', message: 'You have been added', type: 'LeagueUpdate' }
    await sendNotification(senderId, notification, 'league_updates')

    if (updatedLeague) {
      res.status(200).send({ status: 200, message: 'Player successfully added', league: updatedLeague, player: updatedPlayer })
    } else { 
      res.status(400).send({ status: 400, message: 'Player unsuccessfully added' })
    }
  }
  
})
router.route('/leagues/edit-settings').put(authChecker, async (req, res) => {
  const { leagueId, name, max_num_players, num_games, team_size, start_date, end_date, deadline_date, about_text, gender } = req.body

  const league = await Leagues.findOne({_id: leagueId})
  if (!league) {
    res.send({ status: 400, message: 'Could not find this league...'})
  } else {
    // Update league fields
    await Leagues.findOneAndUpdate({_id: leagueId}, {
      $set: {
        name, max_num_players, num_games, team_size, start_date, end_date, deadline_date, about_text, gender
      }
     })

    const updatedLeague = await Leagues.findOne({_id: leagueId})
    if (updatedLeague) {
      res.send({ status: 200, message: 'Successfully updated this leagues settings', league: updatedLeague})
    } else { 
      res.send({ status: 400, message: 'Unsuccessfully updated this league settings' })
    }
  }
  
})
router.route('/league/:id/invite').put(authChecker, async (req, res) => {
  const { playerId } = req.body
  const { id: leagueId } = req.params

  const league = await Leagues.findOne({_id: leagueId})
  if (!league) {
    res.send({ status: 403, message: 'Could not find league'})
  } else {
    // Update league fields
    await Leagues.findOneAndUpdate({_id: leagueId}, { $push: { players_invited: playerId } })
    const updatedLeague = await Leagues.findOne({_id: leagueId})
    if (updatedLeague) {
      const notification = {
        senderId: league.league_creator_id,
        leagueId: league._id,
        gameId: '',
        message: '',
        type: 'LeagueInvitation'
      }
      const notificationResponse = await sendNotification(playerId, notification, 'league_invitations')
      if (notificationResponse.status == 200) {
        res.send({ status: 200, message: 'Successfully sent league invitation', league: updatedLeague})
      } else {
        res.send(notificationResponse)
      }
    } else { 
      res.send({ status: 400, message: 'Unsuccessfully sent league invitation' })
    }
  }
  
})

// Player Mutators
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
      res.send({ status: 403, message: 'Some fields being updated are immutable' })
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

// Notification Mutators
router.route('/player/:id/notification/delete').put(async (req, res) => {
  const playerId = req.params.id
  const { notification, sectionKey } = req.body
  let player = await Players.findOne({_id: playerId})
  
  const deleteResponse = await deleteNotification(playerId, notification, sectionKey)
  if (deleteResponse.status == 200) {
    player = await Players.findOne({_id: playerId})
    if (player) {
      res.send({status: 200, message: 'Successfully removed player notification', player: player})
    } else {
      res.send({ status: 400, message: 'Unsuccessfully removed player notification' })
    }
  } else {
    res.send(deleteResponse)
  }
})
router.route('/player/:id/notification/reorder').put(async (req, res) => {
  const playerId = req.params.id
  const { notifications } = req.body
  await Players.findOneAndUpdate({_id: playerId}, { $set: { notifications: notifications } })
  player = await Players.findOne({_id: playerId})

  if (player) {
    res.send({status: 200, message: 'Successfully reordered player notification', player: player})
  } else {
    res.send({ status: 400, message: 'Unsuccessfully reordered player notification' })
  }
})
router.route('/player/:id/notification/collapse').put(async (req, res) => {
  const playerId = req.params.id
  const { notifications } = req.body
  await Players.findOneAndUpdate({_id: playerId}, { $set: { notifications: notifications } })
  player = await Players.findOne({_id: playerId})

  if (player) {
    res.send({status: 200, message: 'Successfully set collapsed status of player notification', player: player})
  } else {
    res.send({ status: 400, message: 'Unsuccessfully set collapsed status of player notification' })
  }
})
router.route('/player/:id/notification/league-invitation/accept').put(authChecker, async (req, res) => {
  const playerId = req.params.id
  const { notification } = req.body

  let league = await Leagues.findOne({_id: notification.leagueId})
  if (league.players_invited.includes(playerId)) {
    // Add league id to player
    await Players.findOneAndUpdate({_id: playerId}, { $addToSet: { league_ids: league._id } })
    player = await Players.findOne({_id: playerId})
    // Add player stats for new player in league
    await Leagues.findOneAndUpdate({_id: notification.leagueId}, { $addToSet: { player_stats: { player_id: playerId, stats: defaultStats } } })
    // Remove player id from players invited in league
    await Leagues.findOneAndUpdate({_id: notification.leagueId}, { $pull: { players_invited: playerId } })
    // Add player id to players ids in league
    await Leagues.findOneAndUpdate({_id: notification.leagueId}, { $push: { player_ids: playerId } })

    if (player) {
      res.send({status: 200, message: 'Successfully added player to league', player: player})
    } else {
      res.send({ status: 400, message: 'Unsuccessfully added player to league' })
    }
  } else {
    res.send({ status: 400, message: 'League has not invited player with this id' })
  }
})
router.route('/player/:id/notification/send').put(authChecker, async (req, res) => {
  const playerId = req.params.id
  const { notification, notificationKey } = req.body
  const response = await sendNotification(playerId, notification, notificationKey)
  res.send(response)
})

// Game Mutators
const Games = require('../models/game-model');
router.route('/games/:id/update-score').put(authChecker, async (req, res) => {
  const gameId = req.params.id
  const { playerId, plate_appearances, at_bats, singles, doubles, triples, homeruns, team1Score, team2Score } = req.body
  const gameStatKeys = { plate_appearances, at_bats, singles, doubles, triples, homeruns }

  let game = await Games.findOne({_id: gameId})
  if (!game) {
    res.json({status: 400, message: 'Unsuccessfully found game with given id'})
  }

  if (game.player_stats.map(p => p.player_id).includes(playerId)) {
    game.player_stats = game.player_stats.map(p => {
      if (p.player_id == playerId) {
        Object.keys(gameStatKeys).forEach((key) => {
          p.stats[key] = gameStatKeys[key] 
        })
        p.stats.hits = singles + doubles + triples + homeruns
        p.team1Score = team1Score 
        p.team2Score = team2Score
      }
      return p
    })
  } else {
    game.player_stats.push({ player_id: playerId, team_1_score: team1Score, team_2_score: team2Score, stats: gameStatKeys })
  }
  const { team_1_score, team_2_score } = gameScoreCalculation(game)
  game.team_1_score = team_1_score
  game.team_2_score = team_2_score

  await Games.findOneAndUpdate({_id: gameId}, game)
  game = await Games.findOne({_id: gameId})
  if (game) {

    res.json({status: 200, message: 'Successfully updated game score', game: game})
  } else {
    res.json({status: 400, message: 'Unsuccessfully updated game score'})
  }
})
router.route('/games/:id/update-completed').put(authChecker, async (req, res) => {
  const gameId = req.params.id
  const { completed } = req.body

  // Updating the game completed
  let game = await Games.findOne({_id: gameId})
  if (!game) {
    res.json({status: 400, message: 'Unsuccessfully found game with given id'})
  }
  await Games.findOneAndUpdate({_id: gameId}, { $set: { completed: completed } })
  game = await Games.findOne({_id: gameId})
  if (!game) {
    res.json({status: 400, message: 'Unsuccessfully updated game'})
  }

  // console.log(game.player_stats)
  const winningTeam = game.team_1_score > game.team_2_score ? 1 : 2
  // Update overall stats for each player in games stats
  try {
    await Promise.all(game.player_stats.map(async (stat) => {
      let player = await Players.findOne({_id: stat.player_id})
      if (!player) res.json({status: 400, message: 'Unsuccessfully updated players overall stats'})

      const team = game.team_1_ids.includes(player._id) ? 1 : 2
      Object.keys(player.player_stats).filter(s => s !== '$init').forEach(key => {
        player.player_stats[key] += stat.stats[key]
      })
      player.player_stats.hits += (stat.stats.singles + stat.stats.doubles + stat.stats.triples + stat.stats.homeruns)
      player.player_stats.games += 1
      if(winningTeam === team) {
        player.player_stats.wins += 1
      } else if(winningTeam !== team) {
        player.player_stats.losses += 1
      }

      await Players.findOneAndUpdate({_id: stat.player_id}, player)
      const updatedPlayer = await Players.findOne({_id: stat.player_id})
      if(!updatedPlayer) res.json({status: 400, message: 'Unsuccessfully updated players overall stats'})
      return stat
    }))
  } catch(e) {
    console.log(e)
  }

  // Update overall stats for league for each player in games stats
  let league = await Leagues.findOne({_id: game.league_id})
  league.num_games_completed += 1
  await Promise.all(game.player_stats.map(async (stat) => {
    league.player_stats = league.player_stats.map(p => {
      if (p.player_id === stat.player_id) {
        const team = game.team_1_ids.includes(player._id) ? 1 : 2
        p.stats.forEach(key => {
          p.stats[key] += stat.stats[key]
        })
        p.stats.hits += (stat.stats.singles + stat.stats.doubles + stat.stats.triples + stat.stats.homeruns)
        p.stats.games += 1
        if(winningTeam === team) {
          p.stats.wins += 1
        } else if(winningTeam !== team) {
          p.stats.losses += 1
        }
      }
      return p
    })
    return stat
  }))
  await Leagues.findOneAndUpdate({_id: game.league_id}, league)
  const updatedLeague = await Leagues.findOne({_id: game.league_id})
  if(!updatedLeague) res.json({status: 400, message: 'Unsuccessfully updated league overall stats'})
  
  // No failed queries prior to this points... send a successful response
  const notification = { senderId: league.league_creator_id, leagueId: game.league_id, gameId: game._id, message: 'Scores posted', type: 'LeagueUpdate' }
  await Promise.all(game.team_1_ids.map(async (id) => {
    await sendNotification(id, notification, 'league_updates')
  }))
  await Promise.all(game.team_2_ids.map(async (id) => {
    await sendNotification(id, notification, 'league_updates')
  }))

  res.json({status: 200, message: 'Successfully updated game', game: game})
})
router.route('/game/:id/update-date-location').put(authChecker, async (req, res) => {
  const gameId = req.params.id
  const { game_date, game_location } = req.body

  // Updating the game completed
  try {
    await Games.findOneAndUpdate({_id: gameId}, {game_location, game_date})
  } catch {
    res.json({status: 400, message: 'Unsuccessfully updated game'})
  }
  
  let game = await Games.findOne({_id: gameId})
  let league = await Leagues.findOne({_id: game.league_id})
  if (game) {
    const notification = { senderId: league.league_creator_id, leagueId: game.league_id, gameId: game._id, message: 'Game schedule changed', type: 'LeagueUpdate' }
    await Promise.all(game.team_1_ids.map(async (id) => {
      await sendNotification(id, notification, 'league_updates')
    }))
    await Promise.all(game.team_2_ids.map(async (id) => {
      await sendNotification(id, notification, 'league_updates')
    }))

    res.json({status: 200, message: 'Successfully updated game', game: game})
  } else {
    res.json({status: 400, message: 'Unsuccessfully found game with given id'})
  }
})

module.exports = router
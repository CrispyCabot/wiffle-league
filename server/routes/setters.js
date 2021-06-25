const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createAccessToken, createJRTEM, sendRefreshToken } = require('./utils/authorization');
const sendNotification = require('./utils/send-notification');
const deleteNotification = require('./utils/delete-notification');
const authChecker = require("./utils/auth-checker");
const defaultStats = require('./utils/default-stats');

// League Setters
const Leagues = require('../models/league-model')
router.route('/leagues/create').post(authChecker, async (req, res) => {
  const { name, player_ids, player_stats, max_num_players, league_creator_id, game_ids, num_games } = req.body
  const { games_created, team_size, start_date, end_date, deadline_date, about_text, gender } = req.body

  const doesLeagueNameExist = await Leagues.exists({name: name})
  const doesCreatorExist = await Players.exists({_id: league_creator_id})
  if (!doesLeagueNameExist) {
    if (doesCreatorExist) {
      const defaultStats = {
        hits: 0,
        singles: 0,
        doubles: 0,
        triples: 0,
        homeruns: 0,
        plate_appearances: 0,
        at_bats: 0,
        games: 0,
        wins: 0,
        losses: 0,
        points: 0
      }
      const league = await Leagues.create({
        name,
        player_ids: [...player_ids.filter(i => i != league_creator_id), league_creator_id],
        player_stats: [...player_ids.filter(i => i != league_creator_id), league_creator_id].map(id => { return { player_id: id, stats: defaultStats } }),
        max_num_players,
        league_creator_id,
        game_ids,
        num_games,
        games_created,
        team_size,
        start_date,
        end_date,
        deadline_date,
        about_text,
        gender,
        num_games_completed: 0
      })
      // Add league id to player that is creating league
      await Players.findOneAndUpdate({_id: league_creator_id}, { $addToSet: { league_ids: league._id } })
      res.json({league: league, status: 200, message: 'Successfully created league'})
    } else {
      res.json({status: 400, message: 'Cannot create league with invalid creator id'})
    }
  } else {
    res.json({status: 400, message: 'League with this name already exists'})
  }

})
router.route('/leagues/delete').post(authChecker, async (req, res) => {
  const { leagueId } = req.body

  const doesLeagueNameExist = await Leagues.exists({_id: leagueId})
  if (!doesLeagueNameExist) {
    res.json({status: 400, message: 'League does not exist'})
  } else {
    const league = await Leagues.findOne({_id: leagueId})
    await Leagues.deleteOne({_id: leagueId})
    // Send notification to all players that league has been deleted
    const notification = { senderId: league.league_creator_id, leagueId: leagueId, gameId: '', league: league, message: 'League Deleted', type: 'LeagueUpdate' }
    await Promise.all(league.player_ids.map(async (id) => {
      await sendNotification(id, notification, 'league_updates')
      await Players.findOneAndUpdate({_id: id}, { $pull: { league_ids: leagueId } })
    }))
    // Remove invite notification from all players in the leagues invited players
    const inviteNotification = { senderId: league.league_creator_id, leagueId: leagueId, gameId: '', message: '', type: 'LeagueInvitation' }
    await Promise.all(league.players_invited.map(async (id) => {
      await deleteNotification(id, inviteNotification, 'league_invitations')
    }))
    // Remove join requests for league from creator
    const creator = await Players.findOne({_id: league.league_creator_id})
    creator.notifications.league_join_requests.notifications = creator.notifications.league_join_requests.notifications.filter(n => n.leagueId != leagueId)
    await Players.findOneAndUpdate({_id: league.league_creator_id}, { $set: { notifications: creator.notifications } })

    res.json({status: 200, message: 'League successfully deleted', creator})
  }
})

// Player Setters
const Players = require('../models/player-model');
router.route('/players/create').post(async (req, res) => {
  const { email, password, fname, lname, nname, phone, gender } = req.body
  const hashedPassword = await bcrypt.hash(String(password), Number(process.env.SALT_ROUNDS))
  const doesPlayerEmailExist = await Players.exists({email: email})
  if (!doesPlayerEmailExist) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidEmail = re.test(String(email).toLowerCase())
    if (!isValidEmail) {
      res.json({player: response, status: 400, message: 'Email provided is invalid...'})
    } else {
      const player = await Players.create({
          email: email,
          password: hashedPassword,
          firstname: fname,
          lastname: lname,
          nickname: nname,
          phone_number: phone,
          gender: gender,
          player_stats: defaultStats,
          show_information: false,
          league_ids: [],
          token_version: 0,
          notifications: {
            league_invitations: {
              notifications: [],
              order_index: 0,
              collapsed: false
            },
            league_updates: {
              notifications: [],
              order_index: 1,
              collapsed: false
            },
            league_join_requests: {
              notifications: [],
              order_index: 2,
              collapsed: false
            },
            contact_request: {
              notifications: [],
              order_index: 3,
              collapsed: false
            },
            other: {
              notifications: [],
              order_index: 4,
              collapsed: false
            }
          },
          selected_league_schedules: ['All']
        })
      const accessToken = createAccessToken(player)
      sendRefreshToken(req, res, createJRTEM(player))
      res.json({player: player, accessToken: accessToken, status: 200, message: 'Successfully made an account'})
    }
  } else {
    res.json({status: 400, message: 'This email is already in use...'})
  }
})
router.route('/players/login').post(async (req, res) => {
  const { email, password } = req.body
  const doesPlayerEmailExist = await Players.exists({email: email})
  await Players.updateMany({}, { $set: { selected_league_schedules: ['All'] } })
  if (doesPlayerEmailExist) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidEmail = re.test(String(email).toLowerCase())
    if (!isValidEmail) {
      res.json({player: response, status: 400, message: 'Email provided is invalid...'})
    } else {
      const playerWithEmail = await Players.findOne({ email: email })
      const passwordMatches = await bcrypt.compare(password, playerWithEmail.password)
      if (passwordMatches) {
        const accessToken = createAccessToken(playerWithEmail)
        sendRefreshToken(req, res, createJRTEM(playerWithEmail))
        res.json({player: playerWithEmail, accessToken: accessToken, status: 200, message: 'Successfully logged into account'})
      } else {
        res.json({status: 400, message: 'Password provided for this account was incorrect...'})
      }
    }
  } else {
    res.json({status: 400, message: 'No account with this email...'})
  }
})
router.route('/players/logout').post(async (req, res) => {
  sendRefreshToken(req, res, '')
  res.send({
    status: 200,
    message: 'Successfully logged out...'
  })
})

// Game Setters
const Games = require('../models/game-model');
router.route('/games/create').post(authChecker, async (req, res) => {
  const { games } = req.body
  const league_id = games[0].league_id

  let createdGames = []
  await Promise.all(games.map(async (game) => {
    
    const { team_1_ids, team_2_ids, game_date, game_location, completed, team_1_score, team_2_score, player_stats } = game
    const createdGame = await Games.create({
      league_id, team_1_ids, team_2_ids, game_date, game_location, completed, team_1_score, team_2_score, player_stats
    })
    if (!createdGame) {
      res.json({status: 400, message: 'Unsuccessfully created games'})
    } else {
      createdGames.push(createdGame)
    }
    return game
  }))

  if (createdGames.length === games.length) {
    await Leagues.findOneAndUpdate({_id: league_id}, { $addToSet: { game_ids: createdGames.map(g => g._id) }, games_created: true })
    const league = await Leagues.findOne({_id: league_id})
    if (league) {
      const notification = { senderId: league.league_creator_id, leagueId: league._id, message: 'Schedule Posted', type: 'LeagueUpdate' }
      await Promise.all(league.player_ids.map(async (id) => {
        await sendNotification(id, notification, 'league_updates')
      }))
      res.json({status: 200, message: 'Successfully created games', league, games: createdGames})
    } else {
      res.json({status: 400, message: 'Unsuccessfully created games'})
    }
  }
})

// Auth Setters
router.route('/refresh_token').post((req, res) => {
  const token = req.cookies.jrtem
  if (!token) return res.send({ ok: false, accessToken: '' })

  let decodedPayload = null;
  try {
    decodedPayload = jwt.verify(token, process.env.JRTEM_KEY)
  } catch(err) {
    return res.send({ ok: false, accessToken: '' })
  }
  
  Players.findOne({_id: decodedPayload.userId}).then(user => {
    if (!user || user.token_version !== decodedPayload.tokenVersion) return res.send({ ok: false, accessToken: '' });
    sendRefreshToken(req, res, createJRTEM(user))
    res.send({ ok: true, accessToken: createAccessToken(user), user: user })
  })
})

module.exports = router
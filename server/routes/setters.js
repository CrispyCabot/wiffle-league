const router = require("express").Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { createAccessToken, createJRTEM, sendRefreshToken } = require('./utils/authorization');

// League Setters
const Leagues = require('../models/league-model')
router.route('/leagues/create').post(async (req, res) => {
  const { name, player_ids, player_stats, max_num_players, league_creator_id, game_ids, num_games } = req.body
  const { games_created, team_size, start_date, end_date, deadline_date, about_text, gender } = req.body

  const doesLeagueNameExist = await Leagues.exists({name: name})
  const doesCreatorExist = await Players.exists({_id: league_creator_id})
  if (!doesLeagueNameExist) {
    if (doesCreatorExist) {
      const league = await Leagues.create({
        name,
        player_ids: [...player_ids.filter(i => i != league_creator_id), league_creator_id],
        player_stats,
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
        gender
      })
      res.json({league: league, status: 200, message: 'Successfully created league'})
    } else {
      res.json({status: 400, message: 'Cannot create league with invalid creator id'})
    }
  } else {
    res.json({status: 400, message: 'League with this name already exists'})
  }

})

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
      const player = await Players.create({
          email: email,
          password: hashedPassword,
          firstname: fname,
          lastname: lname,
          nickname: nname,
          phone_number: phone,
          gender: gender,
          player_stats: {
            hits: 0,
            singles: 0,
            doubles: 0,
            triples: 0,
            homeruns: 0,
            plate_appearances: 0,
            at_bats: 0,
            games: 0
          },
          show_information: false,
          league_ids: [],
          token_version: 0
        })
      const accessToken = createAccessToken(player)
      sendRefreshToken(req, res, createJRTEM(player))
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
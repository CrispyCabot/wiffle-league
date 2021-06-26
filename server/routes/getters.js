const router = require("express").Router();

// League Getters
const Leagues = require('../models/league-model')
router.route('/leagues').get((req, res) => {
  Leagues.find({}, async (err, response) => {
    if (err) {
      console.log(err)
      return
    }
    res.json(response)
  })
})
router.route('/leagues/games-completed').get((req, res) => {
  Leagues.find({games_created: true}, async (err, response) => {
    if (err) {
      console.log(err)
      return
    }
    res.json(response)
  })
})
router.route('/leagues/:id').get((req, res) => {
  const { id } = req.params
  Leagues.findOne({_id: id}, async (err, response) => {
    if (err) {
      console.log(err)
      return
    }
    res.json(response)
  })
})
router.route('/leagues/:id/stats').get((req, res) => {
  const { id } = req.params
  Leagues.findOne({_id: id}, async (err, response) => {
    if (err) {
      console.log(err)
      return
    }
    res.json(response.player_stats)
  })
})

// Player Getters
const Players = require('../models/player-model')
router.route('/players').get((req, res) => {
  Players.find({}, async (err, response) => {
    if (err) {
      console.log(err)
      return
    }
    res.json(response)
  })
})
router.route('/players/:id').get((req, res) => {
  const { id } = req.params
  Players.findOne({_id: id}, async (err, response) => {
    if (err) {
      console.log(err)
      return
    }
    res.json(response)
  })
})
router.route('/players/:id/selected-schedules').get((req, res) => {
  const { id } = req.params
  Players.findOne({_id: id}, async (err, response) => {
    if (err) {
      console.log(err)
      return
    }
    res.json(response.selected_league_schedules)
  })
})
router.route('/players/:id/created-leagues').get(async (req, res) => {
  const { id } = req.params
  const player = await Players.findOne({_id: id})

  let leagues = []
  await Promise.all(player.league_ids.map(async (leagueId) => {
    const league = await Leagues.findOne({_id: leagueId})
    if (league && league.league_creator_id == id) {
      leagues.push(league)
    }
  }))

  res.send({status: 200, message: 'Successfully fetch players leagues', leagues: leagues})
})

// Game Getters
const Games = require('../models/game-model')
router.route('/games/:id').get((req, res) => {
  const { id } = req.params
  Games.findOne({_id: id}, async (err, response) => {
    if (err) {
      console.log(err)
      return
    }
    res.json(response)
  })
})

module.exports = router
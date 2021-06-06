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
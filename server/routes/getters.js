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

// Game Getters

module.exports = router
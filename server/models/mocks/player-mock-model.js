const mongoose = require('mongoose')
const schema = require('./../../schemas/player-schema')

const Players = mongoose.model('players-mock', schema)

module.exports = Players
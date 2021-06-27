const mongoose = require('mongoose')
const schema = require('./../../schemas/player-schema')

const Players = mongoose.model('players-mocks', schema)

module.exports = Players
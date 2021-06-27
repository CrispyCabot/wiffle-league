const mongoose = require('mongoose')
const schema = require('./../../schemas/game-schema')

const Games = mongoose.model('games-mocks', schema)

module.exports = Games
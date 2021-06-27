const mongoose = require('mongoose')
const schema = require('./../../schemas/game-schema')

const Games = mongoose.model('games-mock', schema)

module.exports = Games
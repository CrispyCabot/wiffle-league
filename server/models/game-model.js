const mongoose = require('mongoose')
const schema = require('./../schemas/game-schema')

const Games = mongoose.model('games', schema)

module.exports = Games
const mongoose = require('mongoose')
const schema = require('./../../schemas/league-schema')

const Leagues = mongoose.model('leagues-mocks', schema)

module.exports = Leagues
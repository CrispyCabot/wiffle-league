const mongoose = require('mongoose')
const schema = require('./../schemas/league-schema')

const Leagues = mongoose.model('leagues', schema)

module.exports = Leagues
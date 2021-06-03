const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stats_schema = new Schema({
  hits: Number,
  singles: Number,
  doubles: Number,
  triples: Number,
  homeruns: Number,
  plate_appearances: Number,
  at_bats: Number,
  games: Number
})

module.exports = {
  stats_schema
}
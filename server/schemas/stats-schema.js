const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stats_schema = new Schema({
  hits: Number,
  single: Number,
  double: Number,
  triple: Number,
  hr: Number,
  plate_appearances: Number,
  at_bats: Number,
  games: Number,
  avg: Number
})

module.exports = {
  stats_schema
}
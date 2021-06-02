const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stats_schema = new Schema({
  id: Schema.Types.ObjectId,
  hits: Number,
  hr: Number,
  single: Number,
  double: Number,
  triple: Number,
  at_bats: Number,
  games: Number,
  avg: Number
})

module.exports = {
  stats_schema
}
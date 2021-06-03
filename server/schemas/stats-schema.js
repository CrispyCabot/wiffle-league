const mongoose = require('mongoose')
const Schema = mongoose.Schema

//I still don't think we should include hits bc that and a bunch of other stuff can be calculated
//from the other fields

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
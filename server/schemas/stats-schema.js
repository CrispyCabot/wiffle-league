const mongoose = require('mongoose')
const Schema = mongoose.Schema

//I still don't think we should include hits bc that and a bunch of other stuff can be calculated
//from the other fields

const stats_schema = new Schema({
  id: Schema.Types.ObjectId,
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
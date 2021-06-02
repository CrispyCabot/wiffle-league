const mongoose = require('mongoose')
const Schema = mongoose.Schema
const stats = require('./stats-schema')

const game_schema = new Schema({
  _id: Schema.Types.ObjectId,
  leauge_id: Schema.Types.ObjectId,
  team_1_ids: [Schema.Types.ObjectId],
  team_2_ids: [Schema.Types.ObjectId],
  game_date: Date,
  game_location: String,
  player_stats: [stats],
})

module.exports = {
  game_schema
}
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const stats = require('./stats-schema')

const game_schema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  league_id: Schema.Types.ObjectId,
  team_1_ids: [Schema.Types.ObjectId],
  team_2_ids: [Schema.Types.ObjectId],
  game_date: Date,
  game_location: String,
  player_stats: [
    { player_id: Schema.Types.ObjectId, stats: stats }
  ],
  completed: Boolean
})

module.exports = game_schema
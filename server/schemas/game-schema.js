const mongoose = require('mongoose')
const Schema = mongoose.Schema
const stats = require('./stats-schema')

const game_schema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  league_id: Schema.Types.ObjectId,
  team_1_ids: [Schema.Types.ObjectId],
  team_1_score: Number,
  team_2_ids: [Schema.Types.ObjectId],
  team_2_score: Number,
  game_date: Date,
  game_location: String,
  player_stats: [
    { player_id: Schema.Types.ObjectId, team_1_score: Number, team_2_score: Number, stats: stats }
  ],
  completed: Boolean
}, {strict: false})

module.exports = game_schema

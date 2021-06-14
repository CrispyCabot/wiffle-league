const mongoose = require('mongoose')
const Schema = mongoose.Schema
const stats = require('./stats-schema')

const league_schema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  name: String,
  player_ids: Array,
  player_stats: [
    { player_id: Schema.Types.ObjectId, stats: stats }
  ],
  max_num_players: Number,
  league_creator_id: Schema.Types.ObjectId,
  game_ids: [Schema.Types.ObjectId],
  num_games: Number,
  num_games_completed: Number,
  games_created: Boolean,
  team_size: Number,
  start_date: Date,
  end_date: Date,
  deadline_date: Date,
  about_text: String,
  gender: String
}, {strict: false})

module.exports = league_schema
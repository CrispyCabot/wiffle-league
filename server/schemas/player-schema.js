const mongoose = require('mongoose')
const Schema = mongoose.Schema
const stats = require('./stats-schema')

const player_schema = new Schema({
  _id: Schema.Types.ObjectId,
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  nickname: String,
  phone_number: String,
  player_stats: [stats],
  show_information: Boolean,
  league_ids: [Schema.Types.ObjectId]
})

module.exports = {
  player_schema
}
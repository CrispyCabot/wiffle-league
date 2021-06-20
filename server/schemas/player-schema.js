const mongoose = require('mongoose')
const Schema = mongoose.Schema
const stats = require('./stats-schema')
const notification = require('./notification-schema')

const player_schema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  nickname: String,
  phone_number: String,
  gender: String,
  player_stats: stats,
  show_information: Boolean,
  league_ids: [Schema.Types.ObjectId],
  token_version: Number,
  notifications: {
    league_invitations: {
      notifications: [ notification ],
      order_index: Number,
      collapsed: Boolean
    },
    league_updates: {
      notifications: [ notification ],
      order_index: Number,
      collapsed: Boolean
    },
    league_join_requests: {
      notifications: [ notification ],
      order_index: Number,
      collapsed: Boolean
    },
    contact_requests: {
      notifications: [ notification ],
      order_index: Number,
      collapsed: Boolean
    },
    other: {
      notifications: [ notification ],
      order_index: Number,
      collapsed: Boolean
    }
  },
  selected_league_schedules: Array
}, {strict: false})

module.exports = player_schema
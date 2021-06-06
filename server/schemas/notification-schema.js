const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notification_schema = {
  senderId:  Schema.ObjectId,
  leagueId:  Schema.ObjectId,
  type: String
}

module.exports = notification_schema
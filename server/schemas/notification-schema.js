const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notification_schema = {
  senderId:  Schema.ObjectId,
  leagueId:  Schema.ObjectId,
  message:  String,
  type: { type: String } // Must nest type: string because type is a mongoose schema keyword
}

module.exports = notification_schema
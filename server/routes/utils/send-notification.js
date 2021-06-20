const Players = require('../../models/player-model');

module.exports = async (playerId, notification, notificationKey) => {
  let player = await Players.findOne({_id: playerId})

  const alreadySentNotification = player.notifications[notificationKey].notifications.some(n => {
    return (
      n.senderId == notification.senderId &&
      n.leagueId == notification.leagueId &&
      n.gameId == notification.gameId &&
      n.message == notification.message &&
      n.type == notification.type
    )
  })

  if (alreadySentNotification) {
    return ({ status: 400, message: 'Already sent this notification' })
  } else {
    player.notifications[notificationKey].notifications = [notification, ...player.notifications[notificationKey].notifications]
    await Players.findOneAndUpdate({_id: playerId}, { $set: { notifications: player.notifications } })
    player = await Players.findOne({_id: playerId})
  
    if (player) {
      return ({status: 200, message: 'Successfully sent notification', notification: notification, player: player})
    } else {
      return ({ status: 400, message: 'Unsuccessfully sent notification', notification: notification })
    }
  }
}
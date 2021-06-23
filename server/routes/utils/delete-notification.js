const Players = require('../../models/player-model');

module.exports = async (playerId, notification, notificationKey) => {
  let player = await Players.findOne({_id: playerId})
  const alreadySentNotification = player.notifications[notificationKey].notifications.some(n => {
    const bool = (
      (String(n.senderId) == String(notification.senderId)) &&
      (String(n.leagueId) == String(notification.leagueId) || (String(notification.leagueId) == '' && !n.leagueId)) &&
      (String(n.gameId) == String(notification.gameId) || (String(notification.gameId) == '' && !n.gameId)) &&
      (String(n.message) == String(notification.message)) &&
      (String(n.type) == String(notification.type))
    )
    return bool
  })

  if (!alreadySentNotification) {
    return ({ status: 403, message: 'This notification has not been sent...' })
  } else {
    player.notifications[notificationKey].notifications = player.notifications[notificationKey].notifications.filter(n => {
      return !(
        (String(n.senderId) == String(notification.senderId)) &&
        (String(n.leagueId) == String(notification.leagueId) || (String(notification.leagueId) == '' && !n.leagueId)) &&
        (String(n.gameId) == String(notification.gameId) || (String(notification.gameId) == '' && !n.gameId)) &&
        (String(n.message) == String(notification.message)) &&
        (String(n.type) == String(notification.type))
      )
    })
    await Players.findOneAndUpdate({_id: playerId}, { $set: { notifications: player.notifications } })
    player = await Players.findOne({_id: playerId})
  
    if (player) {
      return ({status: 200, message: 'Successfully removed notification', notification: notification, player: player})
    } else {
      return ({ status: 400, message: 'Unsuccessfully removed notification', notification: notification })
    }
  }
}
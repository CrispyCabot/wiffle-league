import { LeagueActions } from './modules/leagues'
import { NotificationActions } from './modules/notifications'
import { PlayerActions } from './modules/players'
import { GameActions } from './modules/games'
import { AuthActions } from './modules/auth'

export default {
  ...LeagueActions,
  ...NotificationActions,
  ...PlayerActions,
  ...GameActions,
  ...AuthActions
}
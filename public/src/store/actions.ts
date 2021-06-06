import { LeagueActions } from './modules/leagues'
import { PlayerActions } from './modules/players'
import { GameActions } from './modules/games'
import { AuthActions } from './modules/auth'

export default {
  ...LeagueActions,
  ...PlayerActions,
  ...GameActions,
  ...AuthActions
}
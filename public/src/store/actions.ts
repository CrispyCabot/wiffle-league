import { LeagueActions } from './modules/leagues'
import { PlayerActions } from './modules/players'
import { AuthActions } from './modules/auth'

export default {
  ...LeagueActions,
  ...PlayerActions,
  ...AuthActions
}
import { LeagueActions } from './modules/leagues'
import { PlayerActions } from './modules/players'

export default {
  ...LeagueActions,
  ...PlayerActions
}
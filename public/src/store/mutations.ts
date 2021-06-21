import { IToast } from '@/interfaces/IToast'

export default {
  updateIsLoggedIn(state: any, isLoggedIn: any) {
    state.isLoggedIn = isLoggedIn
  },
  updateLoggedInPlayer(state: any, player: any) {
    state.loggedInPlayer = player
  },
  updateAccessToken(state: any, accessToken: any) {
    state.accessToken = accessToken
  },
  updateGlobalToast(state: any, toast: IToast) {
    state.globalToast = toast
  }
}
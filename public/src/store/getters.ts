import state from "./state"

export default {
  getIsLoggedIn(): Boolean {
    return state.isLoggedIn
  },
  getLoggedInPlayer(): any {
    return state.loggedInPlayer
  },
  getAccessToken(): String {
    return state.accessToken
  },
  getGlobalToastMessage(): String {
    return state.globalToast.message
  },
  getGlobalToastType(): String {
    return state.globalToast.type
  },
  getGlobalToastDuration(): Number {
    return state.globalToast.duration
  },
  getGlobalToastIsShowing(): Boolean {
    return state.globalToast.isShowing
  }
}
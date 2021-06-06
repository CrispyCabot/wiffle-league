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
  }
}
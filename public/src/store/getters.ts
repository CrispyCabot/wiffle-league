import state from "./state"

export default {
  getIsLoggedIn() {
    return state.isLoggedIn
  },
  getLoggedInPlayer() {
    return state.loggedInPlayer
  },
  getAccessToken() {
    return state.accessToken
  }
}
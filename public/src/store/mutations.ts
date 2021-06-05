export default {
  updateIsLoggedIn(state: any, isLoggedIn: any) {
    state.isLoggedIn = isLoggedIn
  },
  updateLoggedInPlayer(state: any, player: any) {
    state.loggedInPlayer = player
  },
  updateAccessToken(state: any, accessToken: any) {
    state.accessToken = accessToken
  }
}
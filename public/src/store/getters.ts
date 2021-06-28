import state from "./state"
const Logo =  require('@/assets/wiffle_ninja_logo_v1.png')

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
  },
  getGlobalToastIsShowingOverride(): Number {
    return state.globalToast.isShowingOverride
  },
  getCurrentLeagueName(): String {
    return state.currentLeagueName
  },
  getCurrentPlayerName(): String {
    return state.currentPlayerName
  },
  getCurrentGameName(): String {
    return state.currentGameName
  },
  getLogo(): any {
    return Logo
  },
  getIsUsingMockData(): Boolean {
    return state.isUsingMockData
  },
  getMockOverride(): Boolean {
    return state.mockOverride
  }
}
import { IToast } from "@/interfaces/IToast"
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
  }
}
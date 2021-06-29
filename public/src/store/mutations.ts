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
    state.globalToast.isShowing = false // Reset any previous toast before updating the next toast
    state.globalToast = {
      ...toast,
      isShowingOverride: state.globalToast.isShowingOverride ? Number(state.globalToast.isShowingOverride) + 1 : 1 // Reset any previous toast before updating the next toast
    }
  },
  updateCurrentLeagueName(state: any, name: string) {
    state.currentLeagueName = name
  },
  updateCurrentPlayerName(state: any, name: string) {
    state.currentPlayerName = name
  },
  updateCurrentGameName(state: any, name: string) {
    state.currentGameName = name
  },
  setIsUsingMockData(state: any, isUsingMockData: Boolean) {
    state.isUsingMockData = isUsingMockData
  },
  setWebSocketConnection(state: any, connection: any) {
    state.webSocketConnection = connection
  }
}
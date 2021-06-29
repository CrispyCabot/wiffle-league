import api from '@/api/api'
import getters from '../getters'

export const NotificationActions = {
  deleteNotifications({ commit, getters }: any, { playerId, notification, sectionKey }: any) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/player/${playerId}/notification/delete` : `/player/${playerId}/notification/delete`
    return new Promise((resolve, reject) => {
      api.put(route, { notification, sectionKey })
        .then(({data}) => {
          commit('updateLoggedInPlayer', data.player)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  reorderNotifications({ commit, getters }: any, { playerId, notifications }: any) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/player/${playerId}/notification/reorder` : `/player/${playerId}/notification/reorder`
    return new Promise((resolve, reject) => {
      api.put(route, { notifications })
        .then(({data}) => {
          commit('updateLoggedInPlayer', data.player)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  collapseNotifications({ commit, getters }: any, { playerId, notifications }: any) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/player/${playerId}/notification/collapse` : `/player/${playerId}/notification/collapse`
    return new Promise((resolve, reject) => {
      api.put(route, { notifications })
        .then(({data}) => {
          commit('updateLoggedInPlayer', data.player)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  acceptLeagueInvitationNotification({ commit, dispatch, getters }: any, { playerId, notification, sectionKey }: any) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/player/${playerId}/notification/league-invitation/accept` : `/player/${playerId}/notification/league-invitation/accept`
    return new Promise((resolve, reject) => {
      api.put(route, { notification, sectionKey })
        .then(({data}) => {
          dispatch('deleteNotifications', { playerId, notification, sectionKey })
          commit('updateLoggedInPlayer', data.player)
          getters.getWebSocketConnection.send(JSON.stringify({ playerId, notification: notification, key: sectionKey }))
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  sendNotification({ getters }: any, { playerId, notification, notificationKey }: any) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/player/${playerId}/notification/send` : `/player/${playerId}/notification/send`
    return new Promise((resolve, reject) => {
      api.put(route, { notification, notificationKey })
        .then(({data}) => {
          getters.getWebSocketConnection.send(JSON.stringify({ playerId, notification: notification, key: notificationKey }))
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  closeWebSocketConnection({ state }: any) {
    const senderId = state.loggedInPlayer._id
    state.webSocketConnection.send(JSON.stringify({ senderId, leaving: true }))
    state.webSocketConnection.close()
  },
  initializeWebSocketConnection({ getters, commit, state }: any) {
    const currPlayer = getters.getLoggedInPlayer
    commit('setWebSocketConnection', new WebSocket(`ws://localhost:3000/${currPlayer._id}`))
    getters.getWebSocketConnection.onopen = () => {
      console.log('Connection is established')
    }
    getters.getWebSocketConnection.onmessage =  (evt: any) => {
      const {notification, key} = JSON.parse(evt.data)
      currPlayer.notifications[key].notifications = [notification, ...currPlayer.notifications[key].notifications]
      commit('updateLoggedInPlayer', currPlayer)
    }
    getters.getWebSocketConnection.onclose = () => { 
      console.log("Connection is closed...")
    }
  }
}
import api from '@/api/api'

export const NotificationActions = {
  deleteNotifications({commit}: any, { playerId, notification, sectionKey }: any) {
    return new Promise((resolve, reject) => {
      api.put(`/player/${playerId}/notification/delete`, { notification, sectionKey })
        .then(({data}) => {
          commit('updateLoggedInPlayer', data.player)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  reorderNotifications({ commit }: any, { playerId, notifications }: any) {
    return new Promise((resolve, reject) => {
      api.put(`/player/${playerId}/notification/reorder`, { notifications })
        .then(({data}) => {
          commit('updateLoggedInPlayer', data.player)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  collapseNotifications({ commit }: any, { playerId, notifications }: any) {
    return new Promise((resolve, reject) => {
      api.put(`/player/${playerId}/notification/collapse`, { notifications })
        .then(({data}) => {
          commit('updateLoggedInPlayer', data.player)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  acceptLeagueInvitationNotification({ commit, dispatch }: any, { playerId, notification, sectionKey }: any) {
    return new Promise((resolve, reject) => {
      api.put(`/player/${playerId}/notification/league-invitation/accept`, { notification, sectionKey })
        .then(({data}) => {
          dispatch('deleteNotifications', { playerId, notification, sectionKey })
          commit('updateLoggedInPlayer', data.player)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  sendNotification(_: any, { playerId, notification, notificationKey }: any) {
    return new Promise((resolve, reject) => {
      api.put(`/player/${playerId}/notification/send`, { notification, notificationKey })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
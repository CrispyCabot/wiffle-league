import api from '@/api/api'
import { TOAST_TYPES } from '@/utils/toastTypes'

export const PlayerActions = {
  fetchPlayerStatsTableColumns() {
    return [
      { columnLabel: 'Hits', columnName: 'hits', maxWidth: 'unset', isHidden: false },
      { columnLabel: '1B', columnName: 'singles', maxWidth: 'unset', isHidden: false },
      { columnLabel: '2B', columnName: 'doubles', maxWidth: 'unset', isHidden: false },
      { columnLabel: '3B', columnName: 'triples', maxWidth: 'unset', isHidden: false },
      { columnLabel: 'HR', columnName: 'homeruns', maxWidth: 'unset', isHidden: false },
      { columnLabel: 'At Bats', columnName: 'at_bats', maxWidth: 'unset', isHidden: false },
      { columnLabel: 'Games', columnName: 'games', maxWidth: 'unset', isHidden: false },
      { columnLabel: 'Plate Appearances', columnName: 'plate_appearances', maxWidth: 'unset', isHidden: false },
      { columnLabel: 'Wins', columnName: 'wins', maxWidth: 'unset', isHidden: false },
      { columnLabel: 'Losses', columnName: 'losses', maxWidth: 'unset', isHidden: false },
      { columnLabel: 'Points', columnName: 'points', maxWidth: 'unset', isHidden: false },
      {columnLabel: 'Id', columnName: 'id', maxWidth: 'unset', isHidden: true}
    ]
  },
  createNewPlayer({ getters }: any, payload: any) {
    const { email, password, fname, lname, nname, phone, gender } = payload
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/players/create` : `/players/create`
    return new Promise((resolve, reject) => {
      api.post(route, { email, password, fname, lname, nname, phone, gender })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  logPlayerIn({ commit, getters }: any, payload: any) {
    const { email, password } = payload
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/players/login` : `/players/login`
    return new Promise((resolve, reject) => {
      api.post(route, { email, password })
          .then(({data}) => {
              if (data.status == 200) {
                commit('updateIsLoggedIn', true)
                commit('updateLoggedInPlayer', data.player)
                commit('updateAccessToken', data.accessToken)
              }
              resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
    })
  },
  logPlayerOut({ commit, getters }: any) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/players/logout` : `/players/logout`
    return new Promise((resolve, reject) => {
      api.post(route)
        .then(({data}) => {
          if (data.status == 200) {
            commit('updateIsLoggedIn', false)
            commit('updateLoggedInPlayer', {})
            commit('updateAccessToken', null)
            commit('updateGlobalToast', {
              message: data.message,
              type: data.status == 400 ? TOAST_TYPES.Error : TOAST_TYPES.Success,
              duration: 5000,
              isShowing: true
            })
            resolve(data)
          } else {
            throw 'Invalid logout'
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateUserSettings({ commit, getters }: any, payload: any) {
    const { playerId, updates } = payload
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/players/update-profile` : `/players/update-profile`
    return new Promise((resolve, reject) => {
      api.put(route, { playerId, updates })
        .then(({data}) => {
            if (data.status == 200) {
              commit('updateLoggedInPlayer', data.player)
              resolve(data)
            } else {
              throw 'Invalid logout'
            }
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchPlayerById({getters}: any, id: string) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/players/${id}` : `/players/${id}`
    return new Promise((resolve, reject) => {
      api.get(route)
        .then(({data}: any) => {
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchPlayers({getters}: any) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/players` : `/players`
    return new Promise((resolve, reject) => {
      api.get(route)
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchPlayerSelectedSchedules({ getters }: any, id: string) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/players/${id}/selected-schedules` : `/players/${id}/selected-schedules`
    return new Promise((resolve, reject) => {
      api.get(route)
        .then(({data}: any) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchPlayerCreatedLeagues({ getters }: any, id: string) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/players/${id}/created-leagues` : `/players/${id}/created-leagues`
    return new Promise((resolve, reject) => {
      api.get(route)
        .then(({data}: any) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  addSelectedSchedule({ getters }: any, id: string) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/players/${getters.getLoggedInPlayer._id}/selected-schedules/add` : `/players/${getters.getLoggedInPlayer._id}/selected-schedules/add`
    return new Promise((resolve, reject) => {
      api.put(route, { id })
        .then(({data}: any) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
      })
  },
  removeSelectedSchedule({ getters }: any, id: string) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/players/${getters.getLoggedInPlayer._id}/selected-schedules/remove` : `/players/${getters.getLoggedInPlayer._id}/selected-schedules/remove`
    return new Promise((resolve, reject) => {
      api.put(route, { id })
        .then(({data}: any) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
      })
  }
}
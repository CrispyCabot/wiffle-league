import api from '@/api/api'

export const GameActions = {
  fetchGameById(_: any, id: string) {
    return new Promise((resolve, reject) => {
      api.get(`/games/${id}`)
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateGameScoreByPlayerId(_: any, payload: any) {
    const { gameId, playerId, plate_appearances, at_bats, singles, doubles, triples, homeruns, team1Score, team2Score } = payload
    return new Promise((resolve, reject) => {
      api.put(`/games/${gameId}/update-score`, { playerId, plate_appearances, at_bats, singles, doubles, triples, homeruns, team1Score, team2Score })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateGameIsCompleted(_: any, payload: any) {
    const { gameId, completed } = payload
    return new Promise((resolve, reject) => {
      api.put(`/games/${gameId}/update-completed`, { completed })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  createGames({ getters }: any, payload: any) {
    api.defaults.headers.common['Authorization'] = `Bearer ${getters.getAccessToken}`
    return new Promise((resolve, reject) => {
      api.post(`/games/create`, { games: payload })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateGameDateLocation({ getters }: any, payload: any) {
    const { gameId, game_date, game_location } = payload
    api.defaults.headers.common['Authorization'] = `Bearer ${getters.getAccessToken}`
    return new Promise((resolve, reject) => {
      api.put(`/game/${gameId}/update-date-location`, { game_date, game_location })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
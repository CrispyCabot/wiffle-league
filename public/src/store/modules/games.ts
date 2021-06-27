import api from '@/api/api'

export const GameActions = {
  fetchGameById({ getters }: any, id: string) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/games/${id}` : `/games/${id}`
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
  updateGameScoreByPlayerId({ getters }: any, payload: any) {
    const { gameId, playerId, plate_appearances, at_bats, singles, doubles, triples, homeruns, team1Score, team2Score } = payload
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/games/${gameId}/update-score` : `/games/${gameId}/update-score`
    return new Promise((resolve, reject) => {
      api.put(route, { playerId, plate_appearances, at_bats, singles, doubles, triples, homeruns, team1Score, team2Score })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateGameIsCompleted({ getters }: any, payload: any) {
    const { gameId, completed } = payload
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/games/${gameId}/update-completed` : `/games/${gameId}/update-completed`
    return new Promise((resolve, reject) => {
      api.put(route, { completed })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  createGames({ getters }: any, payload: any) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/games/create` : `/games/create`
    return new Promise((resolve, reject) => {
      api.post(route, { games: payload })
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
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/game/${gameId}/update-date-location` : `/game/${gameId}/update-date-location`
    return new Promise((resolve, reject) => {
      api.put(route, { game_date, game_location })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
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
  }
}
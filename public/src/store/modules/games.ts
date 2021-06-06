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
  }
}
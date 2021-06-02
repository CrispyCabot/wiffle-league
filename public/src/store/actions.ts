import api from '@/api/api'

export default {
  fetchLeagues() {
    return new Promise((resolve, reject) => {
      api.get('/leagues')
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
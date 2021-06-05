import api from '@/api/api'

export const PlayerActions = {
  createNewPlayer({ getters }: any, payload: any) {
    const { email, password, fname, lname, nname, phone, gender } = payload
    return new Promise((resolve, reject) => {
      api.post(`/players/create`, { email, password, fname, lname, nname, phone, gender })
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
    return new Promise((resolve, reject) => {
      api.post(`/players/login`, { email, password })
          .then(({data}) => {
              if (data.status == 200) {
                  commit('updateIsLoggedIn', true);
                  commit('updateLoggedInPlayer', data.player);
                  commit('updateAccessToken', data.accessToken);
                  resolve(data);
              } else {
                  throw 'Invalid Login'
              }
          })
          .catch((error) => {
            reject(error)
          })
    })
  },
  logPlayerOut({ commit }: any) {
    return new Promise((resolve, reject) => {
      api.post(`/players/logout`)
          .then(({data}) => {
              if (data.status == 200) {
                  commit('updateIsLoggedIn', false);
                  commit('updateLoggedInPlayer', {});
                  commit('updateAccessToken', null);
                  resolve(data);
              } else {
                  throw 'Invalid logout'
              }
          })
          .catch((error) => {
            reject(error)
          })
    })
  }
}
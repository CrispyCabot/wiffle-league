import api from '@/api/api'

export const AuthActions = {
  retrieveRefreshToken({ commit, getters }: any) {
    return new Promise((resolve, reject) => {
      api.post('/refresh_token')
        .then(({ data }) => {
            if (data.ok) {
                commit('updateAccessToken', data.accessToken);
                commit('updateIsLoggedIn', !(data.accessToken === ""));
                commit('updateLoggedInPlayer', data.player);
                resolve(data);
            } else {
                throw 'No refresh token'
            }
        }).catch(error => {
            reject(error)
        })
    })
  }
}
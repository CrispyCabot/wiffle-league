import api from '@/api/api'

export const PlayerActions = {
  createNewPlayer(_: any, payload: any) {
    const { email, password, fname, lname, nname, phone, gender } = payload
    console.log(payload)
    return new Promise((resolve, reject) => {
      api.post(`/players/create`, {
        email,
        password,
        fname,
        lname,
        nname,
        phone,
        gender
      })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
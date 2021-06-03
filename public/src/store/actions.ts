import api from '@/api/api'

export default {
  fetchLeaguesTableColumns() {
    return [
      {columnLabel: 'Name', columnName: 'name', maxWidth: '10rem', isHidden: false},
      {columnLabel: 'Players', columnName: 'players', maxWidth: 'unset', isHidden: false},
      {columnLabel: 'Start Date', columnName: 'startDate', maxWidth: 'unset', isHidden: false},
      {columnLabel: 'End Date', columnName: 'endDate', maxWidth: 'unset', isHidden: false},
      {columnLabel: 'Id', columnName: 'id', maxWidth: 'unset', isHidden: true}
    ]
  },
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
  },
  fetchLeagueById(_: any, id: String) {
    return new Promise((resolve, reject) => {
      api.get(`/leagues/${id}`)
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchLeagueStatsById(_: any, id: String) {
    return new Promise((resolve, reject) => {
      api.get(`/leagues/${id}/stats`)
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
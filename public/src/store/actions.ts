import api from '@/api/api'

export default {
  fetchLeaguesTableColumns() {
    return [
      {columnLabel: 'Name', columnName: 'name', maxWidth: '10rem'},
      {columnLabel: 'Players', columnName: 'players', maxWidth: 'unset'},
      {columnLabel: 'Start Date', columnName: 'startDate', maxWidth: 'unset'},
      {columnLabel: 'End Date', columnName: 'endDate', maxWidth: 'unset'},
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
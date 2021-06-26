import api from '@/api/api'

export const LeagueActions = {
  fetchLeaguesTableColumns() {
    return [
      {columnLabel: 'Name', columnName: 'name', maxWidth: '33vw', isHidden: false},
      {columnLabel: 'Players', columnName: 'players', maxWidth: 'unset', isHidden: false},
      {columnLabel: 'Start Date', columnName: 'startDate', maxWidth: 'unset', isHidden: false},
      {columnLabel: 'End Date', columnName: 'endDate', maxWidth: 'unset', isHidden: false},
      {columnLabel: 'Id', columnName: 'id', maxWidth: 'unset', isHidden: true}
    ]
  },
  fetchLeaguesScheduleTableColumns() {
    return [
      {columnLabel: 'Team 1', columnName: 'team1', maxWidth: 'unset', isHidden: false},
      {columnLabel: 'Team 2', columnName: 'team2', maxWidth: 'unset', isHidden: false},
      {columnLabel: 'Date', columnName: 'date', maxWidth: 'unset', isHidden: false},
      {columnLabel: 'Time', columnName: 'time', maxWidth: 'unset', isHidden: false},
      {columnLabel: 'Location', columnName: 'location', maxWidth: '33vw', isHidden: false},
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
  fetchLeaguesWithCompletedGames() {
    return new Promise((resolve, reject) => {
      api.get('/leagues/games-completed')
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
  },
  createLeague({ getters }:any, payload: any) {
    const { creatorId, name, maxPlayers, numGames, teamSize, startDate, endDate, deadlineDate, other, gender } = payload
    return new Promise((resolve, reject) => {
      api.post(`/leagues/create`, {
        name: name,
        player_ids: [],
        player_stats: [],
        max_num_players: maxPlayers,
        league_creator_id: creatorId,
        game_ids: [],
        num_games: numGames,
        games_created: false,
        team_size: teamSize,
        start_date: startDate,
        end_date: endDate,
        deadline_date: deadlineDate,
        about_text: other,
        gender: gender
      })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  editLeagueSettings({ getters }:any, payload: any) {
    const { leagueId, name, maxPlayers, numGames, teamSize, startDate, endDate, deadlineDate, other, gender } = payload
    return new Promise((resolve, reject) => {
      api.put(`/leagues/edit-settings`, {
        leagueId: leagueId,
        name: name,
        max_num_players: maxPlayers,
        num_games: numGames,
        team_size: teamSize,
        start_date: startDate,
        end_date: endDate,
        deadline_date: deadlineDate,
        about_text: other,
        gender: gender
      })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  removePlayerFromLeagueGivenId({ getters }: any, payload: any) {
    const { playerId, leagueId } = payload
    return new Promise((resolve, reject) => {
      api.put(`/leagues/kick-player`, { playerId, leagueId })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  addPlayerToLeagueGivenId({ getters, commit }: any, payload: any) {
    const { playerId, senderId, leagueId } = payload
    return new Promise((resolve, reject) => {
      api.put(`/leagues/add-player`, { playerId, senderId, leagueId })
        .then(({data}) => {
          commit('updateLoggedInPlayer', data.player)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  invitePlayerToLeague({ getters }: any, { leagueId, playerId }: any) {
    return new Promise((resolve, reject) => {
      api.put(`/league/${leagueId}/invite`, { playerId })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteLeagueById({getters}: any, leagueId: String) {
    return new Promise((resolve, reject) => {
      api.post(`/leagues/delete`, { leagueId })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
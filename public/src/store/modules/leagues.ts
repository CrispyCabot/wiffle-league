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
  fetchLeagues({ getters }: any) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/leagues` : `/leagues`
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
  fetchLeaguesWithCompletedGames({ getters }: any) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/leagues/games-completed` : `/leagues/games-completed`
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
  fetchLeagueById({ getters }: any, id: String) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/leagues/${id}` : `/leagues/${id}`
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
  fetchLeagueStatsById({ getters }: any, id: String) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/leagues/${id}/stats` : `/leagues/${id}/stats`
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
  createLeague({ getters }:any, payload: any) {
    const { creatorId, name, maxPlayers, numGames, teamSize, startDate, endDate, deadlineDate, other, gender } = payload
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/leagues/create` : `/leagues/create`
    return new Promise((resolve, reject) => {
      api.post(route, {
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
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/leagues/edit-settings` : `/leagues/edit-settings`
    return new Promise((resolve, reject) => {
      api.put(route, {
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
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/leagues/kick-player` : `/leagues/kick-player`
    return new Promise((resolve, reject) => {
      api.put(route, { playerId, leagueId })
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
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/leagues/add-player` : `/leagues/add-player`
    return new Promise((resolve, reject) => {
      api.put(route, { playerId, senderId, leagueId })
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
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/league/${leagueId}/invite` : `/league/${leagueId}/invite`
    return new Promise((resolve, reject) => {
      api.put(route, { playerId })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteLeagueById({ getters }: any, leagueId: String) {
    const isUsingMockData = getters.getIsUsingMockData
    const route = isUsingMockData ? `/mock/leagues/delete` : `/leagues/delete`
    return new Promise((resolve, reject) => {
      api.post(route, { leagueId })
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
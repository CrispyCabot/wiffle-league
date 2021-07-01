import { defineComponent } from "@vue/runtime-core";
import { mapActions, mapGetters, mapMutations } from "vuex";
import GridTable from '@/components/tables/grid-table/index.vue'
import RadioButtonGroup from '@/components/inputs/radio-button-group/index.vue'
import GameSelectionModal from '@/components/popups/game-selection-modal/index.vue'
import { TOAST_TYPES } from '@/utils/toastTypes'
import Breadcrumb from '@/components/navigation/breadcrumb/index.vue'

export default defineComponent({
  name: 'league',
  components: {
    GridTable,
    RadioButtonGroup,
    GameSelectionModal,
    Breadcrumb
  },
  data() {
    return {
      leagueId: '',
      leagueData: Object(),
      creator: Object(),
      leaderboardColumns: [
        {columnLabel: 'Placement', columnName: 'placement', maxWidth: 'unset', isHidden: false},
        {columnLabel: 'Name', columnName: 'name', maxWidth: '33vw', isHidden: false, canSort: true},
        {columnLabel: 'Win Loss', columnName: 'winloss', maxWidth: 'unset', isHidden: false},
        {columnLabel: 'Avg', columnName: 'avg', maxWidth: 'unset', isHidden: false, canSort: true},
        {columnLabel: 'Slg', columnName: 'slg', maxWidth: 'unset', isHidden: false, canSort: true},
        {columnLabel: 'Points', columnName: 'points', maxWidth: 'unset', isHidden: false, canSort: true},
        {columnLabel: 'Id', columnName: 'id', maxWidth: 'unset', isHidden: true}
      ],
      scheduleColumns: Array<any>(),
      overallStatsColumns: Array<any>(),
      playersColumns: [
        {columnLabel: 'Name', columnName: 'name', maxWidth: '33vw', isHidden: false},
        {columnLabel: 'Avg', columnName: 'avg', maxWidth: 'unset', isHidden: false},
        {columnLabel: 'Id', columnName: 'id', maxWidth: 'unset', isHidden: true}
      ],
      players: Array<any>(),
      scheduleRows: Array<any>(),
      fields: {
        name: { value: '', placeholder: 'Name', name: 'name', isRequired: true, type: 'input' },
        deadlineDate: { value: '', placeholder: 'Deadline Date', name: 'deadlineDate', isRequired: true, type: 'date' },
        startDate: { value: '', placeholder: 'Start Date', name: 'startDate', isRequired: true, type: 'date' },
        endDate: { value: '', placeholder: 'End Date', name: 'endDate', isRequired: true, type: 'date' },
        maxPlayers: { value: '', placeholder: 'Max Players', name: 'maxPlayers', isRequired: true, type: 'number' },
        teamSize: { value: '', placeholder: 'Team Size', name: 'teamSize', isRequired: true, type: 'number' },
        numGames: { value: '', placeholder: 'Num Games', name: 'numGames', isRequired: true, type: 'number' },
        other: { value: '', placeholder: 'Other', name: 'other', isRequired: false, type: 'text-area' },
        gender: { value: '', placeholder: 'Gender', name: 'gender', isRequired: true, type: 'radio-group' }
      },
      genderRadioButtons: [
        'Male',
        'Female',
        'Other'
      ],
      isSettingsEditing: false,
      isSelectingGames: false
    }
  },
  computed: {
    ...mapGetters(['getLoggedInPlayer', 'getIsLoggedIn']),
    isLeagueStarted(): Boolean {
      return this.leagueData ? this.leagueData.games_created : false
    },
    isLoggedInPlayerCreatorOfLeague(): Boolean {
      if (!this.leagueData || !this.leagueData.league_creator_id) return false
      return this.leagueData.league_creator_id == this.getLoggedInPlayer._id && this.getIsLoggedIn
    },
    isLoggedInPlayerInLeague(): Boolean {
      if (!this.leagueData || !this.leagueData.player_ids) return false
      return this.leagueData.player_ids.includes(this.getLoggedInPlayer._id) && this.getIsLoggedIn
    },
    playersRows(): Array<Object> {
      if (!this.leagueData) return []
      return this.players.map((p: any) => {
        return {
          name: { text: p.firstname + ' ' + p.lastname, type: 'string' },
          avg: { text: this.calcAvg(p.player_stats), type: 'string' },
          kick: { text: 'Kick Player',  type: this.isLoggedInPlayerCreatorOfLeague ? 'button' : 'hidden' },
          id: { text: p._id, type: 'hidden' }
        }
      })
    },
    statsRows(): Array<Object> {
      return this.players.map((player: any) => {
        const stats: { [key: string]: any } =  { 
          name: { text: player.firstname + ' ' + player.lastname, type: 'string' },
          id: { text: player._id, type: 'hidden' }
        } 
        const playerInLeague = this.leagueData.player_stats.find((p: any)=> p.player_id == player._id)
        if (playerInLeague) {
          const playersStats = playerInLeague.stats
          if (playersStats) {
            this.overallStatsColumns.map((c: any) => c.columnName).forEach((s: string) => {
              if (s == 'avg') {
                stats[s] = { text: this.calcAvg(playersStats), type: 'numeric' } 
              } else if (s == 'slg') {
                stats[s] = { text: this.calcSlg(playersStats), type: 'numeric' } 
              } else if (s != 'name' && s != 'id') {
                stats[s] = { text: playersStats[s], type: 'numeric' } 
              }
            })
          }
        }
        return stats
      })
    },
    leaderboardRows(): Array<Object> {
      const rows = this.leagueData.player_stats.map((player: any) => {
        return {
          placement: { text: this.getPlayerPlacement(player), type: 'string' },
          name: { text: player.firstname + ' ' + player.lastname, type: 'string' },
          winloss: { text: player.stats.wins + ' - ' + player.stats.losses, type: 'string' },
          avg: { text: this.calcAvg(player.stats), type: 'numeric' },
          slg: { text: this.calcSlg(player.stats), type: 'numeric' },
          points: { text: player.stats.points, type: 'numeric' },
          id: { text: player.player_id, type: 'hidden' }
        }
      })
      return rows
    },
    isSaveEnabled(): Boolean {
      return Boolean(
        this.fields.name.value &&
        this.fields.deadlineDate.value &&
        this.fields.startDate.value &&
        this.fields.endDate.value &&
        this.fields.maxPlayers.value &&
        this.fields.teamSize.value &&
        this.fields.numGames.value &&
        this.fields.gender.value &&
        this.isStartDateValid &&
        this.isEndDateValid &&
        this.isDeadlineDateValid
      )
    },
    isStartDateValid(): Boolean {
      return Boolean(
        (new Date(this.fields.startDate.value) < new Date(this.fields.endDate.value)) ||
        this.fields.startDate.value == ''
      )
    },
    isEndDateValid(): Boolean {
      return Boolean(
        (new Date(this.fields.endDate.value)) > (new Date(this.fields.startDate.value)) ||
        this.fields.endDate.value == ''
      )
    },
    isDeadlineDateValid(): Boolean {
      return Boolean(
        (new Date(this.fields.deadlineDate.value) <= new Date(this.fields.startDate.value)) ||
        this.fields.deadlineDate.value == ''
      )
    }
  },
  async created() {
    this.leagueId = String(this.$route.params.leagueId)
    this.leagueData = await this.fetchLeagueById(this.leagueId)
    this.updateCurrentLeagueName(this.leagueData.name)
    this.creator = await this.fetchPlayerById(this.leagueData.league_creator_id)

    // Column setup
    const overallStatsColumns = await this.fetchPlayerStatsTableColumns()
    const nameColumn = { columnLabel: 'Name', columnName: 'name', maxWidth: '33vw', isHidden: false }
    const idColumn = { columnLabel: 'Id', columnName: 'id', maxWidth: '33vw', isHidden: true }
    this.overallStatsColumns = [ nameColumn, ...overallStatsColumns, idColumn ].map(c => {
      c.canSort = true
      return c
    })
    this.scheduleColumns = await this.fetchLeaguesScheduleTableColumns()
    this.scheduleColumns = this.scheduleColumns.map(c => {
        c.canSort = c.columnName == 'date'
        return c
      })

    await this.setupScheduleRows() 
    this.setupFieldsValues()
  },
  methods: {
    ...mapActions([
      'fetchLeagueById',
      'fetchLeagueStatsById',
      'fetchPlayerById',
      'removePlayerFromLeagueGivenId',
      'deleteLeagueById',
      'fetchPlayerStatsTableColumns',
      'fetchLeaguesScheduleTableColumns',
      'fetchGameById',
      'editLeagueSettings',
      'sendNotification'
    ]),
    ...mapMutations(['updateGlobalToast', 'updateLoggedInPlayer', 'updateCurrentLeagueName']),
    async fetchPlayers() {
      this.players = await Promise.all(this.leagueData.player_ids.map(async (id: any) => {
        return await this.fetchPlayerById(id)
      }))
      this.players.sort((a, b) => b.player_stats.points - a.player_stats.points)
    },
    async setupLeagueDataStats() {
      this.leagueData.player_stats = await Promise.all(this.leagueData.player_stats.map(async (p: any) => {
        const player = await this.fetchPlayerById(p.player_id)
        p.firstname = player.firstname
        p.lastname = player.lastname
        return p
      }))
      this.leagueData.player_stats.sort((a: any, b: any) => {
        if (Number(a.stats.points) < Number(b.stats.points)) return 1
        if (Number(a.stats.points) > Number(b.stats.points)) return -1
        return 0
      })
    },
    async setupScheduleRows() {
      this.scheduleRows = await Promise.all(this.leagueData.game_ids.map(async (id: any) => {
        const game = await this.fetchGameById(id)
        const team1 = await Promise.all(game.team_1_ids.map(async (team1Id: any) => {
          const player = await this.fetchPlayerById(team1Id)
          return player.firstname
        }))
        const team2 = await Promise.all(game.team_2_ids.map(async (team2Id: any) => {
          const player = await this.fetchPlayerById(team2Id)
          return player.firstname
        }))
        return {
          team1: { text: team1.join(', '), type: 'string-wrap' },
          team2: { text: team2.join(', '), type: 'string-wrap' },
          date: { text: new Date(game.game_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date-wrap' },
          time: { text: new Date(game.game_date).toLocaleTimeString(undefined, {hour: 'numeric', minute:'2-digit', hour12: true}), type: 'date-wrap' },
          location: { text: game.game_location, type: 'location-wrap' },
          id: { text: game._id, type: 'hidden' }
        }
      }))
    },
    calcAvg(stats: any) {
      const { hits, at_bats } = stats
      if (hits == 0) return '.000'
      if (hits > at_bats) return '.000'

      let avg = String(hits / at_bats)
      if (avg.length > 5) return avg.slice(1, 5)
      while (avg.length < 5) avg += '0'
      return avg.slice(1, 5)
    },
    calcSlg(stats: any) {
      const { hits, singles, doubles, triples, homeruns, at_bats } = stats
      if (hits == 0) return '0'
      if (hits > at_bats) return '0' 
      return String((singles + (2 * doubles) + (3 * triples) + (4 * homeruns)) / at_bats).slice(0, 5)
    },
    async handleKickPlayerClick(row: any, column: any) {
      const res = await this.removePlayerFromLeagueGivenId({ playerId: row.id.text, leagueId: this.leagueData._id })
      if (res.status === 200) {
        this.leagueData = res.league
      }
      this.updateGlobalToast({
        message: res.message,
        type: res.status == 400 ? TOAST_TYPES.Error : res.status == 403 ? TOAST_TYPES.Warning : TOAST_TYPES.Success,
        duration: 5000,
        isShowing: true
      })
    },
    cancelStartLeague() {
      this.isSelectingGames = false
    },
    startLeague() {
      this.isSelectingGames = true
    },
    submitScores() {
      this.$router.push(`/league/${this.leagueData._id}/games`)
    },
    async joinLeague() {
      const message = `wants to join ${this.leagueData.name}`
      const res = await this.sendNotification({
        notification: { senderId: this.getLoggedInPlayer._id, leagueId: this.leagueId, message: message, type: 'LeagueJoinRequest' },
        notificationKey: 'league_join_requests',
        playerId: this.leagueData.league_creator_id
      })
      this.updateGlobalToast({
        message: res.message,
        type: res.status == 400 ? TOAST_TYPES.Error : res.status == 403 ? TOAST_TYPES.Warning : TOAST_TYPES.Success,
        duration: 5000,
        isShowing: true
      })
    },
    async deleteLeague() {
      const res = await this.deleteLeagueById(this.leagueData._id)
      if (res.status === 200) {
        this.$router.push('/')
        if (this.getLoggedInPlayer._id == res.creator._id) {
          this.updateLoggedInPlayer(res.creator)
        }
      }
      this.updateGlobalToast({
        message: res.message,
        type: res.status == 400 ? TOAST_TYPES.Error : res.status == 403 ? TOAST_TYPES.Warning : TOAST_TYPES.Success,
        duration: 5000,
        isShowing: true
      })
    },
    getPlayerPlacement(player: any): String {
      const playerIndex = [...this.leagueData.player_stats]
        .sort((a: any, b: any) => {
          if (Number(a.stats.points) < Number(b.stats.points)) return 1
          if (Number(a.stats.points) > Number(b.stats.points)) return -1
          return 0
        })
        .findIndex((p: any) => p.player_id === player.player_id) + 1

      if (playerIndex < 20) {
        if (playerIndex === 1) return playerIndex + 'st'
        else if (playerIndex === 2) return playerIndex + 'nd'
        else if (playerIndex === 3) return playerIndex + 'rd'
        else return playerIndex + 'th'
      } else {
        if (playerIndex % 10 === 1) return playerIndex + 'st'
        else if (playerIndex % 10 === 2) return playerIndex + 'nd'
        else if (playerIndex % 10 === 3) return playerIndex + 'rd'
        else if (playerIndex % 10 === 0) return playerIndex + 'th'
        return ''
      }
    },
    setGender(gender: string) {
      this.fields.gender.value = gender
    },
    async saveSettings() {
      const res = await this.editLeagueSettings({
        leagueId: this.leagueData._id,
        name: this.fields.name.value,
        maxPlayers: this.fields.maxPlayers.value,
        numGames: this.fields.numGames.value,
        teamSize: this.fields.teamSize.value,
        startDate: this.fields.startDate.value,
        endDate: this.fields.endDate.value,
        deadlineDate: this.fields.deadlineDate.value,
        other: this.fields.other.value,
        gender: this.fields.gender.value
      })

      if (res.status === 200) {
        this.leagueData = res.league
        this.isSettingsEditing = false
      }
      this.updateGlobalToast({
        message: res.message,
        type: res.status == 400 ? TOAST_TYPES.Error : res.status == 403 ? TOAST_TYPES.Warning : TOAST_TYPES.Success,
        duration: 5000,
        isShowing: true
      })
   },
    editSettings() {
      this.isSettingsEditing = true
    },
    cancelSettings() {
      this.isSettingsEditing = false
      this.setupFieldsValues()
    },
    setupFieldsValues() {
      if (this.leagueData) {
        this.fields.name.value = this.leagueData.name
        this.fields.deadlineDate.value = new Date(this.leagueData.deadline_date).toISOString().substr(0, 10)
        this.fields.startDate.value = new Date(this.leagueData.start_date).toISOString().substr(0, 10)
        this.fields.endDate.value = new Date(this.leagueData.end_date).toISOString().substr(0, 10)
        this.fields.maxPlayers.value = this.leagueData.max_num_players
        this.fields.teamSize.value = this.leagueData.team_size
        this.fields.numGames.value = this.leagueData.num_games
        this.fields.other.value = this.leagueData.about_text
        this.fields.gender.value = this.leagueData.gender
      }
    },
    playerClick(row: any) {
      this.$router.push(`/league/${this.leagueId}/player/${row.id.text}`)
    },
    gameClick(row: any) {
      this.$router.push(`/league/${this.leagueId}/game-summary/${row.id.text}`)
    },
    gamesCreated(league: any, games: any) {
      this.leagueData = league
      this.isSelectingGames = false
    },
    async handleLeaderBoardSortChange({column, direction}: any) {
      const { columnName } = column
      const mult = direction == 'up' ? 1 : -1
      if (columnName == 'name') {
        this.leagueData.player_stats = this.leagueData.player_stats.sort((a: any, b: any) => {
          if (a.firstname + a.lastname < b.firstname + b.lastname) return -1 * mult
          if (a.firstname + a.lastname > b.firstname + b.lastname) return 1 * mult
          return 0
        })
      } else if (columnName == 'avg') {
        this.leagueData.player_stats = this.leagueData.player_stats.sort((a: any, b: any) => {
          if (this.calcAvg(a.stats) < this.calcAvg(b.stats)) return 1 * mult
          if (this.calcAvg(a.stats) > this.calcAvg(b.stats)) return -1 * mult
          return 0
        })
      } else if (columnName == 'slg') {
        this.leagueData.player_stats = this.leagueData.player_stats.sort((a: any, b: any) => {
          if (this.calcSlg(a.stats) < this.calcSlg(b.stats)) return 1 * mult
          if (this.calcSlg(a.stats) > this.calcSlg(b.stats)) return -1 * mult
          return 0
        })
      } else if (columnName == 'points') {
        this.leagueData.player_stats = this.leagueData.player_stats.sort((a: any, b: any) => {
          if (Number(a.stats.points) < Number(b.stats.points)) return 1 * mult
          if (Number(a.stats.points) > Number(b.stats.points)) return -1 * mult
          return 0
        })
      }
    },
    handleScheduleSortChange({column, direction}: any) {
      const mult = direction == 'up' ? 1 : -1
      this.scheduleRows = this.scheduleRows.sort((a: any, b: any) => {
        if (new Date(a.date.text) < new Date(b.date.text)) return 1 * mult
        if (new Date(a.date.text) > new Date(b.date.text)) return -1 * mult
        return 0
      })
    },
    handleStatsSortChange({column, direction}: any) {
      const { columnName } = column
      const mult = direction == 'up' ? 1 : -1
      if (columnName == 'name') {
        this.players = this.players.sort((a: any, b: any) => {
          if (a.firstname + a.lastname < b.firstname + b.lastname) return -1 * mult
          if (a.firstname + a.lastname > b.firstname + b.lastname) return 1 * mult
          return 0
        }) 
      } else if (columnName == 'avg') {
        this.players = this.players.sort((a: any, b: any) => {
          const aLeagueStats = this.leagueData.player_stats.find((p: any) => p.player_id == a._id).stats
          const bLeagueStats = this.leagueData.player_stats.find((p: any) => p.player_id == b._id).stats
          if (this.calcAvg(aLeagueStats) < this.calcAvg(bLeagueStats)) return 1 * mult
          if (this.calcAvg(aLeagueStats) > this.calcAvg(bLeagueStats)) return -1 * mult
          return 0
        })
      } else if (columnName == 'slg') {
        this.players = this.players.sort((a: any, b: any) => {
          const aLeagueStats = this.leagueData.player_stats.find((p: any) => p.player_id == a._id).stats
          const bLeagueStats = this.leagueData.player_stats.find((p: any) => p.player_id == b._id).stats
          if (this.calcSlg(aLeagueStats) < this.calcSlg(bLeagueStats)) return 1 * mult
          if (this.calcSlg(aLeagueStats) > this.calcSlg(bLeagueStats)) return -1 * mult
          return 0
        })
      } else {
        const key = column.columnName
        this.players = this.players.sort((a: any, b: any) => {
          const aLeagueStats = this.leagueData.player_stats.find((p: any) => p.player_id == a._id).stats
          const bLeagueStats = this.leagueData.player_stats.find((p: any) => p.player_id == b._id).stats
          if (aLeagueStats[key] < bLeagueStats[key]) return 1 * mult
          if (aLeagueStats[key] > bLeagueStats[key]) return -1 * mult
          return 0
        })
      }
    }
  },
  watch: {
    async leagueData() {
      if (this.leagueData) {
        await this.fetchPlayers()
        await this.setupLeagueDataStats()
        await this.setupScheduleRows()
      }
    }
  }
})
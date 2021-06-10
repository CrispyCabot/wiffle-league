import { defineComponent } from "@vue/runtime-core";
import { mapActions, mapGetters } from "vuex";
import GridTable from '@/components/tables/grid-table/index.vue'
import RadioButtonGroup from '@/components/inputs/radio-button-group/index.vue'

export default defineComponent({
  name: 'league',
  components: {
    GridTable,
    RadioButtonGroup
  },
  data() {
    return {
      leagueId: '',
      leagueData: Object(),
      creator: Object(),
      leaderboardColumns: [
        {columnLabel: 'Placement', columnName: 'placement', maxWidth: 'unset', isHidden: false},
        {columnLabel: 'Name', columnName: 'name', maxWidth: '33vw', isHidden: false},
        {columnLabel: 'Win Loss', columnName: 'winloss', maxWidth: 'unset', isHidden: false},
        {columnLabel: 'Avg', columnName: 'avg', maxWidth: 'unset', isHidden: false},
        {columnLabel: 'Points', columnName: 'points', maxWidth: 'unset', isHidden: false},
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
      isSettingsEditing: false
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
          avg: { text: this.calcAvg(p), type: 'string' },
          kick: { text: 'Kick Player',  type: this.isLoggedInPlayerCreatorOfLeague ? 'button' : 'hidden' },
          id: { text: p._id, type: 'hidden' }
        }
      })
    },
    statsRows(): Array<Object> {
      return this.players.map((player: any) => {
        const stats: { [key: string]: any } =  { name: { text: player.firstname + ' ' + player.lastname, type: 'string' } } 

        if (player.player_stats) {
          Object.keys(player.player_stats).forEach((s: string) => {
            stats[s] = { text: player.player_stats[s], type: 'numeric' } 
          })
        }

        return stats
      })
    },
    leaderboardRows(): Array<Object> {
      const rows = this.players.map((player: any) => {
        return {
          placement: { text: this.getPlayerPlacement(player), type: 'string' },
          name: { text: player.firstname + ' ' + player.lastname, type: 'string' },
          winloss: { text: player.player_stats.wins + ' - ' + player.player_stats.losses, type: 'string' },
          avg: { text: this.calcAvg(player), type: 'numeric' },
          points: { text: player.player_stats.points, type: 'numeric' },
          id: { text: player._id, type: 'hidden' }
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
    this.leagueId = String(this.$route.params.id)
    this.leagueData = await this.fetchLeagueById(this.leagueId)
    this.creator = await this.fetchPlayerById(this.leagueData.league_creator_id)

    // Column setup
    const overallStatsColumns = await this.fetchPlayerStatsTableColumns()
    const nameColumn = { columnLabel: 'Name', columnName: 'name', maxWidth: '33vw', isHidden: false }
    this.overallStatsColumns = [ nameColumn, ...overallStatsColumns ]
    this.scheduleColumns = await this.fetchLeaguesScheduleTableColumns()

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
      'editLeagueSettings'
    ]),
    async fetchPlayers() {
      this.players = await Promise.all(this.leagueData.player_ids.map(async (id: any) => {
        return await this.fetchPlayerById(id)
      }))
      this.players.sort((a, b) => b.player_stats.points - a.player_stats.points)
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
          time: { text: new Date(game.game_date).toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit', hour12: true}), type: 'date-wrap' },
          location: { text: game.game_location, type: 'location-wrap' },
          id: { text: game._id, type: 'hidden' }
        }
      }))
    },
    calcAvg(player: any) {
      const { hits, plate_appearances } = player.player_stats
      if (hits == 0) return '.000'
      if (hits > plate_appearances) return '.000'

      const avg = String(hits / plate_appearances)
      if (avg.length > 5) return avg.slice(1, 5)
      return avg
    },
    async handleKickPlayerClick(row: any, column: any) {
      const res = await this.removePlayerFromLeagueGivenId({ playerId: row.id.text, leagueId: this.leagueData._id })
      if (res.status === 200) {
        this.leagueData = res.league
      }
    },
    startLeague() {
      // TODO
      // Should take you to create games pages
    },
    submitScores() {
      // TODO
    },
    joinLeague() {
      // TODO
    },
    async deleteLeague() {
      const res = await this.deleteLeagueById(this.leagueData._id)
      if (res.status === 200) {
        console.log('success')
        this.$router.push('/')
      } else {
        console.log('failure', res.message)
      }
    },
    getPlayerPlacement(player: any): String {
      const playerIndex = this.players.findIndex((p: any) => p._id === player._id) + 1

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
    }
  },
  watch: {
    async leagueData() {
      if (this.leagueData) {
        await this.fetchPlayers()
        await this.setupScheduleRows()
      }
    }
  }
})
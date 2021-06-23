import { defineComponent } from "@vue/runtime-core"
import { mapActions, mapGetters, mapMutations } from "vuex";
import GridTable from '@/components/tables/grid-table/index.vue'
import { TOAST_TYPES } from '@/utils/toastTypes'

export default defineComponent({
  name: 'game-summary',
  components: {
    GridTable
  },
  data() {
    return {
      gameId: '',
      gameData: Object(),
      team1: Array<Object>(),
      team2: Array<Object>(),
      team1Score: null,
      team2Score: null,
      fields: {
        plate_appearances: {text: 'Plate Appearances', value: null },
        at_bats: {text: 'At bats', value: null },
        singles: {text: 'Singles', value: null },
        doubles: {text: 'Doubles', value: null },
        triples: {text: 'Triples', value: null },
        homeruns: {text: 'Home Runs', value: null }
      },
      overallStatsColumns: Array<any>(),
      league: Object(),
      gameDate: '',
      gameTime: '',
      gameLoc: '',
      isEditingGame: false
    }
  },
  computed: {
    ...mapGetters(['getLoggedInPlayer']),
    gameIsCompleted(): Boolean {
      return this.gameData.completed
    },
    playerIsInGame(): Boolean {
      if (!this.gameData || !this.gameData.team_1_ids || !this.gameData.team_2_ids || !this.getLoggedInPlayer) return false
      return this.gameData.team_1_ids.includes(this.getLoggedInPlayer._id) || this.gameData.team_2_ids.includes(this.getLoggedInPlayer._id)
    },
    playerHasSubmittedScores(): Boolean {
      if (!this.gameData || !this.getLoggedInPlayer) return false
      return this.gameData.player_stats.map((p: any) => p.player_id).includes(this.getLoggedInPlayer._id)
    },
    canSubmitScores(): Boolean {
      return Boolean(
        this.fields.plate_appearances.value &&
        this.fields.at_bats.value &&
        this.fields.singles.value &&
        this.fields.doubles.value &&
        this.fields.triples.value &&
        this.fields.homeruns.value &&
        this.team1Score &&
        this.team2Score
      )
    },
    statsRows(): Array<Object> {
      return [...this.team1, ...this.team2].map((player: any) => {
        const stats: { [key: string]: any } =  { name: { text: player.firstname + ' ' + player.lastname, type: 'string' } } 

        if (this.gameData.player_stats.map((p: any) => p.player_id).includes(player._id)) {
          const playerData = this.gameData.player_stats.find((p: any) => p.player_id == player._id)
          Object.keys(playerData.stats).forEach((s: string) => {
            if (this.overallStatsColumns.map(c => c.columnName).includes(s))
              stats[s] = { text: playerData.stats[s], type: 'numeric' } 
          })
        }

        return stats
      })
    },
    isLeagueCreator(): Boolean {
      if (!this.league || !this.league.league_creator_id || !this.getLoggedInPlayer) return false
      return this.league.league_creator_id === this.getLoggedInPlayer._id
    },
    allPlayersHaveSubmitted(): Boolean {
      let playersWithStatsSubmitted: any = {}
      const players = [...this.gameData.team_1_ids, ...this.gameData.team_2_ids]
      players.forEach((id: any) => {
        playersWithStatsSubmitted[id] = false
        if (this.gameData.player_stats.map((p: any) => p.player_id).includes(id))
          playersWithStatsSubmitted[id] = true
      })
      
      playersWithStatsSubmitted = Object.keys(playersWithStatsSubmitted).filter((key: any) => {
        return !playersWithStatsSubmitted[key]
      })
      
      return playersWithStatsSubmitted.length === 0
    }
  },
  async created() {
    this.gameId = String(this.$route.params.id)
    this.gameData = await this.fetchGameById(this.gameId)
    this.league = await this.fetchLeagueById(this.gameData.league_id)

    this.team1 = await Promise.all(this.gameData.team_1_ids.map(async (id: any) => await this.fetchPlayerById(id)))
    this.team2 = await Promise.all(this.gameData.team_2_ids.map(async (id: any) => await this.fetchPlayerById(id)))

    const overallStatsColumns = await this.fetchPlayerStatsTableColumns()
    const nameColumn = { columnLabel: 'Name', columnName: 'name', maxWidth: '33vw', isHidden: false }
    const filteredStatsColumnNames = ['games', 'wins', 'losses', 'points']
    this.overallStatsColumns = [ nameColumn, ...overallStatsColumns.filter((c: any) => !filteredStatsColumnNames.includes(c.columnName)) ]

    if (this.gameIsCompleted) {
      this.team1Score = this.gameData.team_1_score
      this.team2Score = this.gameData.team_2_score
    }

    this.gameDate = new Date(this.gameData.game_date).toISOString().substr(0, 10)
    const times = new Date(this.gameData.game_date)
      .toLocaleTimeString()
      .split(' ')
      .map((str: string, i: number) => i == 0 ? str.substring(0, str.length - 3) : str)
    this.gameTime = times[0]
      .split(':')
      .map((str: string, i: number) => {
        if (i == 0 && str.length == 1) {
          str = '0' + str
          if (times[1] == 'PM') {
            str = String(parseInt(str) + 12)
          }
        } 
        return str
      })
      .join(':')
    this.gameLoc = this.gameData.game_location
  },
  methods: {
    ...mapActions([
      'fetchGameById',
      'fetchPlayerById',
      'fetchPlayerStatsTableColumns',
      'updateGameScoreByPlayerId',
      'fetchLeagueById',
      'updateGameIsCompleted',
      'updateGameDateLocation'
    ]),
    ...mapMutations(['updateGlobalToast']),
    reSubmit() {
      this.gameData.player_stats = this.gameData.player_stats.filter((p: any) => p.player_id !== this.getLoggedInPlayer._id)
    },
    async submitScores() {
      const res = await this.updateGameScoreByPlayerId({
        gameId: this.gameData._id,
        playerId: this.getLoggedInPlayer._id,
        plate_appearances: this.fields.plate_appearances.value,
        at_bats: this.fields.at_bats.value,
        singles: this.fields.singles.value,
        doubles: this.fields.doubles.value,
        triples: this.fields.triples.value,
        homeruns: this.fields.homeruns.value,
        team1Score: this.team1Score,
        team2Score: this.team2Score
      })

      if (res.status === 200) {
        this.gameData = res.game
      }

      this.updateGlobalToast({
        message: res.message,
        type: res.status == 400 ? TOAST_TYPES.Error : res.status == 403 ? TOAST_TYPES.Warning : TOAST_TYPES.Success,
        duration: 5000,
        isShowing: true
      })
    },
    async completeGame() {
      const res = await this.updateGameIsCompleted({
        gameId: this.gameData._id,
        completed: true
      })

      if(res.status === 200) {
        this.gameData = res.game
        this.team1Score = this.gameData.team_1_score
        this.team2Score = this.gameData.team_2_score
      }

      this.updateGlobalToast({
        message: res.message,
        type: res.status == 400 ? TOAST_TYPES.Error : res.status == 403 ? TOAST_TYPES.Warning : TOAST_TYPES.Success,
        duration: 5000,
        isShowing: true
      })
    },
    playerClick(row: any) {
      this.$router.push(`/player/${row.id.text}`)
    },
    async startEditingGame() {
      if (!this.isEditingGame) {
        this.isEditingGame = true
        return
      }

      const date = new Date(this.gameDate + ', ' + this.gameTime)
      const res = await this.updateGameDateLocation({ gameId: this.gameData._id, game_date: date, game_location: this.gameLoc })
      if (res.status === 200) {
        this.gameData = res.game
      }
      this.updateGlobalToast({
        message: res.message,
        type: res.status == 400 ? TOAST_TYPES.Error : res.status == 403 ? TOAST_TYPES.Warning : TOAST_TYPES.Success,
        duration: 5000,
        isShowing: true
      })
    },
    cancelEditingGame() {
      this.isEditingGame = false
    }
  }
})
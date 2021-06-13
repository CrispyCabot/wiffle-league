import { defineComponent } from "@vue/runtime-core";
import { mapActions, mapGetters } from "vuex";
import GridTable from '@/components/tables/grid-table/index.vue'

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
      overallStatsColumns: Array<any>()
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
    }
  },
  async created() {
    this.gameId = String(this.$route.params.id)
    this.gameData = await this.fetchGameById(this.gameId)

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
  },
  methods: {
    ...mapActions(['fetchGameById', 'fetchPlayerById', 'fetchPlayerStatsTableColumns', 'updateGameScoreByPlayerId']),
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
    }
  }
})
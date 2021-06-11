import { defineComponent } from "@vue/runtime-core";
import { mapActions } from "vuex";
import GridTable from '@/components/tables/grid-table/index.vue'

export default defineComponent({
  name: 'games',
  components: {
    GridTable
  },
  data() {
    return {
      leagueId: '',
      leagueData: Object(),
      scheduleColumns: Array<any>(),
      scheduleRows: Array<any>()
    }
  },
  computed: {},
  async created() {
    this.leagueId = String(this.$route.params.id)
    this.leagueData = await this.fetchLeagueById(this.leagueId)
    this.scheduleColumns = [...await this.fetchLeaguesScheduleTableColumns(), { columnName: 'submit', columnLabel: '', maxWidth: 'unset', isHidden: false}]
    await this.setupScheduleRows()
  },
  methods: {
    ...mapActions([
      'fetchLeagueById',
      'fetchLeaguesScheduleTableColumns',
      'fetchGameById',
      'fetchPlayerById'
    ]),
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
          submit: { text: 'Submit scores', type: 'button' },
          id: { text: game._id, type: 'hidden' }
        }
      }))
    },
    handleGameClick(e: any) {
      this.$router.push(`/game-summary/${e.id}`)
    },
    handleSubmitScoreClick(row: any, column: any) {

    }
  }
})
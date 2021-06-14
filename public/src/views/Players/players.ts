import { defineComponent } from "@vue/runtime-core";
import { mapActions, mapGetters } from "vuex";
import GridTable from '@/components/tables/grid-table/index.vue'
import RadioButtonGroup from '@/components/inputs/radio-button-group/index.vue'

export default defineComponent({
  name: 'players',
  components: {
    GridTable
  },
  data() {
    return {
      leagueId: '',
      creator: Object(),
      overallStatsColumns: Array<any>(),
      players: Array<any>()
    }
  },
  computed: {
    ...mapGetters(['getLoggedInPlayer', 'getIsLoggedIn']),
    statsRows(): Array<Object> {
      if (!this.players) return []
      return this.players.map((player: any) => {
        const stats: { [key: string]: any } =  { 
          name: { text: player.firstname + ' ' + player.lastname, type: 'string' },
          id: { text: player._id, type: 'hidden' }
        }
        if (player.player_stats) {
          Object.keys(player.player_stats).forEach((s: string) => {
            stats[s] = { text: player.player_stats[s], type: 'numeric' } 
          })
        }
        return stats
      })
    }
  },
  async created() {
    this.players = await this.fetchPlayers()

    // Column setup
    const overallStatsColumns = await this.fetchPlayerStatsTableColumns()
    const nameColumn = { columnLabel: 'Name', columnName: 'name', maxWidth: '33vw', isHidden: false }
    const idColumn = { columnLabel: 'Id', columnName: 'id', maxWidth: '33vw', isHidden: true }
    this.overallStatsColumns = [ nameColumn, ...overallStatsColumns, idColumn ]
  },
  methods: {
    ...mapActions([
      'fetchLeagueById',
      'fetchPlayerById',
      'fetchPlayerStatsTableColumns',
      'fetchPlayers'
    ]),
    async getPlayers() {
      this.players = await this.fetchPlayers()
      this.players.sort((a, b) => b.player_stats.points - a.player_stats.points)
    },
    calcAvg(player: any) {
      const { hits, plate_appearances } = player.player_stats
      if (hits == 0) return '.000'
      if (hits > plate_appearances) return '.000'

      const avg = String(hits / plate_appearances)
      if (avg.length > 5) return avg.slice(1, 5)
      return avg
    },
    playerClick(row: any) {
      this.$router.push(`/player/${row.id.text}`)
    },
  },
  watch: {
    async playerData() {
      if (this.players) {
        await this.fetchPlayers()
      }
    }
  }
})
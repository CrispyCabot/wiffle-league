import { defineComponent } from "@vue/runtime-core";
import { mapActions, mapGetters } from "vuex";
import GridTable from '@/components/tables/grid-table/index.vue'
import Pagination from '@/components/navigation/pagination/index.vue'
import PaginationMixin from '@/mixins/pagination-mixin'
import Breadcrumb from '@/components/navigation/breadcrumb/index.vue'

export default defineComponent({
  name: 'players',
  components: {
    GridTable,
    Pagination,
    Breadcrumb
  },
  mixins: [PaginationMixin],
  data() {
    return {
      leagueId: '',
      creator: Object(),
      overallStatsColumns: Array<any>(),
      players: Array<any>(),
      paginationRefresh: true
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
          this.overallStatsColumns.filter(c => c.columnName != 'name' && c.columnName != 'id').map(c => c.columnName).forEach((s: string) => {
            if (s == 'avg') {
              stats[s] = { text: this.calcAvg(player), type: 'numeric' } 
            } else if (s == 'slg') {
              stats[s] = { text: this.calcSlg(player), type: 'numeric' } 
            } else {
              stats[s] = { text: player.player_stats[s], type: 'numeric' } 
            }
          })
        }
        return stats
      })
    },
    splicedRows(): Array<Object> {
      return this.statsRows.slice(this.startingIndex, this.endingIndex)
    }
  },
  async created() {
    this.players = await this.fetchPlayers()

    // Column setup
    const overallStatsColumns = await this.fetchPlayerStatsTableColumns()
    const nameColumn = { columnLabel: 'Name', columnName: 'name', maxWidth: '33vw', isHidden: false }
    const idColumn = { columnLabel: 'Id', columnName: 'id', maxWidth: '33vw', isHidden: true }
    this.overallStatsColumns = [ nameColumn, ...overallStatsColumns, idColumn ].map(c => {
      c.canSort = true
      return c
    })
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
      const { hits, at_bats } = player.player_stats
      if (hits == 0) return '.000'
      if (hits > at_bats) return '.000'

      const avg = String(hits / at_bats)
      if (avg.length > 5) return avg.slice(1, 5)
      return avg
    },
    calcSlg(player: any) {
      const { hits, singles, doubles, triples, homeruns, at_bats } = player.player_stats
      if (hits == 0) return '0'
      if (hits > at_bats) return '0' 
      return String((singles + (2 * doubles) + (3 * triples) + (4 * homeruns)) / at_bats).slice(0, 5)
    },
    playerClick(row: any) {
      this.$router.push(`/player/${row.id.text}`)
    },
    handleSortChange({column, direction}: any) {
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
          if (this.calcAvg(a) < this.calcAvg(b)) return 1 * mult
          if (this.calcAvg(a) > this.calcAvg(b)) return -1 * mult
          return 0
        })
      } else if (columnName == 'slg') {
        this.players = this.players.sort((a: any, b: any) => {
          if (this.calcSlg(a) < this.calcSlg(b)) return 1 * mult
          if (this.calcSlg(a) > this.calcSlg(b)) return -1 * mult
          return 0
        })
      } else {
        const key = column.columnName
        this.players = this.players.sort((a: any, b: any) => {
          if (a.player_stats[key] < b.player_stats[key]) return 1 * mult
          if (a.player_stats[key] > b.player_stats[key]) return -1 * mult
          return 0
        })
      }
    }
  },
  watch: {
    async playerData() {
      if (this.players) {
        await this.fetchPlayers()
      }
    },
    statsRows() {
      this.paginationRefresh = !this.paginationRefresh
    }
  }
})
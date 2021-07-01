import GridTable from '@/components/tables/grid-table/index.vue'
import PaginationMixin from '@/mixins/pagination-mixin'
import { defineComponent } from '@vue/runtime-core'
import { mapActions } from 'vuex'

export default defineComponent({
  name:'home',
  components: {
    GridTable
  },
  mixins: [PaginationMixin],
  data() {
    return {
      leagues: [],
      columns: [],
      tableLoading: false
    }
  },
  async created() {
    this.tableLoading = true
    this.leagues = await this.fetchLeagues()
    this.columns = await this.fetchLeaguesTableColumns()
    this.tableLoading = false
  },
  computed: {
    rows(): Array<Object> {
      return this.leagues.map((league: any) => {
        return {
          name: {text: league.name, type: 'string'},
          players: {text: league.player_ids.length + ' / ' + league.max_num_players, type: 'numeric-left'},
          startDate: {text: new Date(league.start_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date'},
          endDate: {text: new Date(league.end_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date'},
          dealineDate: {text: new Date(league.deadline_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date'},
          id: {text: league._id, type: 'hidden'}
        }
      })
    },
    splicedRows(): Array<Object> {
      return this.rows.slice(this.startingIndex, this.endingIndex)
    }
  },
  methods: {
    ...mapActions(['fetchLeagues', 'fetchLeaguesTableColumns']),
    handleLeagueClick(row: any) {
      const id = row.id.text
      this.$router.push(`/league/${id}`)
    },
    redirect(link: string) {
      this.$router.push(link)
    },
    handleSortChange({column, direction}: any) {
      const { columnName } = column
      const mult = direction == 'up' ? 1 : -1
      if (columnName == 'name') {
        this.leagues = this.leagues.sort((a: any, b: any) => {
          if (a.name < b.name) return -1 * mult
          if (a.name > b.name) return 1 * mult
          return 0
        })
      } else if (columnName == 'players') {
        this.leagues = this.leagues.sort((a: any, b: any) => {
          if (a.player_ids.length < b.player_ids.length) return 1 * mult
          if (a.player_ids.length > b.player_ids.length) return -1 * mult
          return 0
        })
      } else if (columnName == 'startDate' || columnName == 'endDate' || columnName == 'deadlineDate') {
        const key = columnName == 'startDate' ? 'start_date' : columnName == 'endDate' ? 'end_date' : 'deadline_date'
        this.leagues = this.leagues.sort((a: any, b: any) => {
          if (new Date(a[key]) < new Date(b[key])) return 1 * mult
          if (new Date(a[key]) > new Date(b[key])) return -1 * mult
          return 0
        })
      }
    }
  }
})
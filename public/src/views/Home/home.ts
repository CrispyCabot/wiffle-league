import GridTable from '@/components/tables/grid-table/index.vue'
import { defineComponent } from '@vue/runtime-core'
import { mapActions } from 'vuex'

export default defineComponent({
  name:'home',
  components: {
    GridTable
  },
  data() {
    return {
      leagues: [],
      leagueTable: {
        columns: [
          {columnLabel: 'Name', columnName: 'name', maxWidth: '10rem'},
          {columnLabel: 'Players', columnName: 'players', maxWidth: 'unset'},
          {columnLabel: 'Start Date', columnName: 'startDate', maxWidth: 'unset'},
          {columnLabel: 'End Date', columnName: 'endDate', maxWidth: 'unset'},
        ],
        hasPagination: true,
        hasSizeSelector: true,
        pageIndex: 0,
        pageSize: 4,
        startingIndex: 0,
        endingIndex: 4
      }
    }
  },
  async created() {
    this.leagues = await this.fetchLeagues()
  },
  mounted() {
    this.leagueTable.endingIndex = this.leagueTable.startingIndex + this.leagueTable.pageSize
  },
  computed: {
    rows(): Array<Object> {
      return this.leagues.map((league: any) => {
        return {
          name: {text: league.name, type: 'string'},
          players: {text: league.player_ids.length + ' / ' + league.max_num_players, type: 'numeric'},
          startDate: {text: new Date(league.start_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date'},
          endDate: {text: new Date(league.end_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date'}
        }
      })
    },
    splicedRows(): Array<Object> {
      return this.rows.slice(this.leagueTable.startingIndex, this.leagueTable.endingIndex)
    }
  },
  methods: {
    ...mapActions(['fetchLeagues']),
    changePageIndex(pageIndex: number) {
      this.leagueTable.pageIndex = pageIndex
      this.leagueTable.startingIndex = pageIndex * this.leagueTable.pageSize
      this.leagueTable.endingIndex = this.leagueTable.startingIndex + this.leagueTable.pageSize
    },
    changePageSize(pageSize: number) {
      this.leagueTable.pageSize = pageSize
      this.leagueTable.endingIndex = this.leagueTable.startingIndex + this.leagueTable.pageSize
    }
  }
})
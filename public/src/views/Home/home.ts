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
      columns: []
    }
  },
  async created() {
    this.leagues = await this.fetchLeagues()
    this.columns = await this.fetchLeaguesTableColumns()
  },
  computed: {
    rows(): Array<Object> {
      return this.leagues.map((league: any) => {
        return {
          name: {text: league.name, type: 'string'},
          players: {text: league.player_ids.length + ' / ' + league.max_num_players, type: 'numeric'},
          startDate: {text: new Date(league.start_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date'},
          endDate: {text: new Date(league.end_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date'},
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
    }
  }
})
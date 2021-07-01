import { defineComponent } from "@vue/runtime-core";
import { mapActions } from "vuex";
import SearchInput from '@/components/inputs/search-input/index.vue'
import RadioSlider from '@/components/inputs/radio-slider/index.vue'
import GridTable from '@/components/tables/grid-table/index.vue'
import RowCard from '@/components/cards/row-card/index.vue'
import Pagination from '@/components/navigation/pagination/index.vue'
import PaginationMixin from '@/mixins/pagination-mixin'
import Breadcrumb from '@/components/navigation/breadcrumb/index.vue'

export default defineComponent({
  name: 'leagues',
  components: {
    SearchInput,
    RadioSlider,
    GridTable,
    RowCard,
    Pagination,
    Breadcrumb
  },
  mixins: [PaginationMixin],
  data() {
    return {
      leagues: [],
      searchValue: '',
      displayValues: ['Detailed', 'Simple'],
      selectedDisplayValue: 'Simple',
      columns: [],
      paginationRefresh: true,
      tableLoading: false
    }
  },
  computed: {
    rows(): Array<Object> {
      return this.leagues
        .filter((league: any) => {
          if (this.searchValue == '') return true
          return (this.searchValue.toLowerCase() == league.name.toLowerCase().slice(0, this.searchValue.length))
        })
        .map((league: any) => {
          const simple_row = {
            name: {text: league.name, subtitle: '', type: 'title'},
            players: {text: league.player_ids.length + ' / ' + league.max_num_players, type: 'numeric'},
            id: {text: league._id, type: 'hidden'}
          }
          if (this.selectedDisplayValue == 'Simple') return simple_row
          
          return {
            ...simple_row,
            name: {text: league.name, type: 'string'},
            startDate: {text: new Date(league.start_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date'},
            endDate: {text: new Date(league.end_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date'},
            dealineDate: {text: new Date(league.deadline_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date'}
          }
        })
    },
    splicedRows(): Array<Object> {
      return this.rows.slice(this.startingIndex, this.endingIndex)
    }
  },
  async created() {
    this.tableLoading = true
    this.leagues = await this.fetchLeagues()
    this.columns = await this.fetchLeaguesTableColumns()
    this.tableLoading = false
  },
  methods: {
    ...mapActions(['fetchLeagues', 'fetchLeaguesTableColumns']),
    searchValueChange(value: string) {
      this.searchValue = value
    },
    displayViewChange(view: string) {
      this.selectedDisplayValue = view
    },
    handleLeagueClick(row: any) {
      const id = row.id.text
      this.$router.push(`/league/${id}`)
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
  },
  watch: {
    rows() {
      this.paginationRefresh = !this.paginationRefresh
    }
  }
})
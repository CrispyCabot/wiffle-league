import { defineComponent } from "@vue/runtime-core";
import { mapActions } from "vuex";
import SearchInput from '@/components/inputs/search-input/index.vue'
import RadioSlider from '@/components/inputs/radio-slider/index.vue'
import GridTable from '@/components/tables/grid-table/index.vue'
import TableMixin from '@/mixins/grid-table-mixin'

export default defineComponent({
  name: 'leagues',
  components: {
    SearchInput,
    RadioSlider,
    GridTable
  },
  mixins: [TableMixin],
  data() {
    return {
      leagues: [],
      searchValue: '',
      displayValues: ['Detailed', 'Simple'],
      selectedDisplayValue: 'Detailed',
      columns: [],
      paginationRefresh: true
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
          return {
            name: {text: league.name, type: 'string'},
            players: {text: league.player_ids.length + ' / ' + league.max_num_players, type: 'numeric'},
            startDate: {text: new Date(league.start_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date'},
            endDate: {text: new Date(league.end_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date'}
          }
        })
    },
    splicedRows(): Array<Object> {
      return this.rows.slice(this.startingIndex, this.endingIndex)
    }
  },
  async created() {
    this.leagues = await this.fetchLeagues()
    this.columns = await this.fetchLeaguesTableColumns()
  },
  methods: {
    ...mapActions(['fetchLeagues', 'fetchLeaguesTableColumns']),
    searchValueChange(value: string) {
      this.searchValue = value
    },
    displayViewChange(view: string) {
      this.selectedDisplayValue = view
    }
  },
  watch: {
    rows() {
      this.paginationRefresh = !this.paginationRefresh
    }
  }
})
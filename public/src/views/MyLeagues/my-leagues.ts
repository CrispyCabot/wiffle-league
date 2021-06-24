import { defineComponent } from "@vue/runtime-core";
import { mapActions, mapGetters, mapMutations } from "vuex"
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
      allLeagues: [],
      playerID: "",
      leagues: [],
      searchValue: '',
      displayValues: ['Detailed', 'Simple'],
      selectedDisplayValue: 'Simple',
      columns: [],
      paginationRefresh: true
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIn', 'getLoggedInPlayer']),
    rows(): Array<Object> {
      return this.leagues
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
          }
        })
    },
    splicedRows(): Array<Object> {
      return this.rows.slice(this.startingIndex, this.endingIndex)
    }
  },
  async created() {
    this.allLeagues = await this.fetchLeagues()
    const pid = this.getLoggedInPlayer._id
    const playerOwnedLeagues: any = []
    this.allLeagues.forEach(function(val: any, index: number) {
      if (val.league_creator_id == pid)
        playerOwnedLeagues.push(val)
    })
    this.leagues = playerOwnedLeagues

    this.columns = await this.fetchLeaguesTableColumns()
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
    redirect(link: any) {
      console.log(link)
      this.$router.push(link.redirect)
    }
  },
  watch: {
    rows() {
      this.paginationRefresh = !this.paginationRefresh
    }
  }
})
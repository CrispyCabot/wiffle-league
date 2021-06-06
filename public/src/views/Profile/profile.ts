import { defineComponent } from "@vue/runtime-core"
import GridTable from '@/components/tables/grid-table/index.vue'
import PaginationMixin from '@/mixins/pagination-mixin'
import { mapActions, mapGetters } from "vuex"

export default defineComponent({
  name: 'profile',
  components: {
    GridTable
  },
  mixins: [PaginationMixin],
  data() {
    return {
      columns: []
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIn', 'getLoggedInPlayer']),
    stats(): any {
      if (!this.getLoggedInPlayer) return {}
      return this.getLoggedInPlayer.player_stats
    },
    row(): Array<Object> {
      if (!this.stats) return []
      Object.keys(this.stats).forEach((s: any) => {
        this.stats[s] = { text: this.stats[s], type: 'numeric-left' } 
      })
      return [ this.stats ]
    },
    splicedRows(): Array<Object> {
      return this.row.slice(this.startingIndex, this.endingIndex)
    }
  },
  async created() {
    this.columns = await this.fetchPlayerStatsTableColumns()
  },
  methods: {
    ...mapActions(['fetchPlayerStatsTableColumns'])
  }
})
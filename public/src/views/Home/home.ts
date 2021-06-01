import GridTable from '@/components/tables/grid-table/index.vue'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name:'home',
  components: {
    GridTable
  },
  data() {
    return {
      leagueTable: {
        columns: [
          {columnLabel: 'Name', columnName: 'name', maxWidth: '10rem'},
          {columnLabel: 'Players', columnName: 'players', maxWidth: 'unset'},
          {columnLabel: 'Start Date', columnName: 'startDate', maxWidth: 'unset'},
          {columnLabel: 'End Date', columnName: 'endDate', maxWidth: 'unset'},
        ],
        rows: [
          {
            name: {text: 'Summer 2021 Mens League', type: 'string'},
            players: {text: '6/6', type: 'numeric'},
            startDate: {text: '5/28/21', type: 'date'},
            endDate: {text: '7/28/21', type: 'date'}
          },
          {
            name: {text: 'Summer 2021 Womens League', type: 'string'},
            players: {text: '2/6', type: 'numeric'},
            startDate: {text: '5/28/21', type: 'date'},
            endDate: {text: '7/28/21', type: 'date'}
          },
          {
            name: {text: 'Cool League', type: 'string'},
            players: {text: '4/6', type: 'numeric'},
            startDate: {text: '5/28/21', type: 'date'},
            endDate: {text: '7/28/21', type: 'date'}
          },
          {
            name: {text: 'Dumb League', type: 'string'},
            players: {text: '6/6', type: 'numeric'},
            startDate: {text: '5/28/21', type: 'date'},
            endDate: {text: '7/28/21', type: 'date'}
          },
          {
            name: {text: '5', type: 'string'},
            players: {text: '6/6', type: 'numeric'},
            startDate: {text: '5/28/21', type: 'date'},
            endDate: {text: '7/28/21', type: 'date'}
          },
          {
            name: {text: '6', type: 'string'},
            players: {text: '2/6', type: 'numeric'},
            startDate: {text: '5/28/21', type: 'date'},
            endDate: {text: '7/28/21', type: 'date'}
          },
          {
            name: {text: '7', type: 'string'},
            players: {text: '4/6', type: 'numeric'},
            startDate: {text: '5/28/21', type: 'date'},
            endDate: {text: '7/28/21', type: 'date'}
          },
          {
            name: {text: '8', type: 'string'},
            players: {text: '6/6', type: 'numeric'},
            startDate: {text: '5/28/21', type: 'date'},
            endDate: {text: '7/28/21', type: 'date'}
          },
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
  mounted() {
    this.leagueTable.endingIndex = this.leagueTable.startingIndex + this.leagueTable.pageSize
  },
  computed: {
    splicedRows(): Array<Object> {
      return this.leagueTable.rows.slice(this.leagueTable.startingIndex, this.leagueTable.endingIndex)
    }
  },
  methods: {
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
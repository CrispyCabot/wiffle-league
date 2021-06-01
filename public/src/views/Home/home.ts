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
        ],
        hasPagination: true,
        pageIndex: 1,
        pageSize: 1,
        startingPage: 1,
        endingPage: 4
      }
    }
  },
  created() {
    this.leagueTable.endingPage = Math.ceil(this.leagueTable.rows.length / this.leagueTable.pageSize)
  },
  methods: {
    changePageIndex(pageIndex: number) {
      // TODO
      // Once the backend is setup, a new fetch will fill overwrite rows in data
      // with pageSize amount of rows starting from new pageIndex in database 
      this.leagueTable.pageIndex = pageIndex
    },
    changePageSize(pageSize: number) {
      this.leagueTable.pageSize = pageSize
      this.leagueTable.endingPage = Math.ceil(this.leagueTable.rows.length / this.leagueTable.pageSize)
    }
  }
})
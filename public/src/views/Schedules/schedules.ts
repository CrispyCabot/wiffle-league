import { defineComponent } from "@vue/runtime-core";
import { mapActions, mapGetters } from "vuex";
import Pagination from '@/components/navigation/pagination/index.vue'
import PaginationMixin from '@/mixins/pagination-mixin'
import ContentDropdown from '@/components/dropdowns/content-dropdown/index.vue'
import GridTable from '@/components/tables/grid-table/index.vue'
import MultiItemSelector from '@/components/dropdowns/multi-item-selector/index.vue'

export default defineComponent({
  name: 'schedules',
  components: {
    Pagination,
    ContentDropdown,
    GridTable,
    MultiItemSelector
  },
  mixins: [ PaginationMixin ],
  data() {
    return {
      selectedSchedules:  Array<any>(),
      shownLeagues: Array<Promise<any>>(),
      allLeagues: [],
      columns: [],
      gamesShown:  Array<any>(),
      loadingGames: false,
      paginationRefresh: false
    }
  },
  computed: {
    ...mapGetters(['getLoggedInPlayer', 'getIsLoggedIn']),
    splicedLeagues(): Array<Object> {
      return this.shownLeagues.slice(this.startingIndex, this.endingIndex)
    },
    allLeagueNames(): Array<any> {
      return this.allLeagues.map((l: any) => l.name)
    },
    selectedSchedulesNames(): Array<any> {
      return this.allLeagues.filter((l: any) => this.selectedSchedules.includes(l._id)).map((l: any) => l.name)
    }
  },
  async created() {
    this.allLeagues = await this.fetchLeagues()
    this.columns = await this.fetchLeaguesScheduleTableColumns()
    this.shownLeagues = this.allLeagues
    await this.setSelectedSchedules()
  },
  methods: {
    ...mapActions([
      'fetchPlayerSelectedSchedules',
      'fetchLeagueById',
      'fetchLeagues',
      'fetchLeaguesScheduleTableColumns',
      'fetchGameById',
      'fetchPlayerById',
      'addSelectedSchedule',
      'removeSelectedSchedule'
    ]),
    findGames(league: any) {
      const gameShownForLeague = this.gamesShown.find((g: any) => g.leagueId == league._id)
      if (gameShownForLeague) {
        return gameShownForLeague.games
      } else {
        return []
      }
    },
    async loadGames(league: any) {
      this.loadingGames = true
      const games = await Promise.all(league.game_ids.map(async (id: any) => {
        const game = await this.fetchGameById(id)
        const team1 = await Promise.all(game.team_1_ids.map(async (team1Id: any) => {
          const player = await this.fetchPlayerById(team1Id)
          return player.firstname
        }))
        const team2 = await Promise.all(game.team_2_ids.map(async (team2Id: any) => {
          const player = await this.fetchPlayerById(team2Id)
          return player.firstname
        }))
        return {
          team1: { text: team1.join(', '), type: 'string-wrap' },
          team2: { text: team2.join(', '), type: 'string-wrap' },
          date: { text: new Date(game.game_date).toLocaleDateString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric'}), type: 'date-wrap' },
          time: { text: new Date(game.game_date).toLocaleTimeString(), type: 'date-wrap' },
          location: { text: game.game_location, type: 'location-wrap' },
          id: { text: game._id, type: 'hidden' }
        }
      }))

      if (this.gamesShown.includes((g: any) => g.leagueId == league._id)) return

      this.gamesShown.push({
        leagueId: league._id,
        games
      })
      
      this.loadingGames = false
    },
    handleGameClick(e: any) {
      this.$router.push(`/games/${e.id}`)
    },
    async setSelectedSchedules() {
      if (this.getLoggedInPlayer && this.getIsLoggedIn && this.getLoggedInPlayer._id) {
        this.selectedSchedules = await this.fetchPlayerSelectedSchedules(this.getLoggedInPlayer._id)
      } else {
        this.selectedSchedules = [ 'All', ...this.allLeagues.map((l: any) => l._id) ]
      }
    },
    handleScheduleSelection(leagueName: string) {
      const league: any = this.allLeagues.find((l: any) => l.name == leagueName)
      
      if (league) {
        if (this.selectedSchedules.includes(league._id)) {
          this.selectedSchedules = this.selectedSchedules.filter(l => l != league._id)
          if (this.selectedSchedules.length == 1 && this.selectedSchedules[0] == 'All') {
            this.selectedSchedules = this.selectedSchedules.filter(l => l != 'All')
          }
          if (this.getIsLoggedIn) {
            this.removeSelectedSchedule(league._id)
          }
        } else {
          this.selectedSchedules = [...this.selectedSchedules, league._id]
          if (this.getIsLoggedIn) {
            this.addSelectedSchedule(league._id)
          }
        }
      }
    }
  },
  watch: {
    async getLoggedInPlayer() {
      await this.setSelectedSchedules()
    },
    async selectedSchedules() {
      if (!this.selectedSchedules || this.selectedSchedules.length == 0) {
        this.shownLeagues = []
        return
      }

      if (this.selectedSchedules.length == 1 && this.selectedSchedules[0] == 'All') {
        this.shownLeagues = this.allLeagues
        this.selectedSchedules = this.allLeagues.map((l: any) => l._id)
      } else {
        const filteredSelectedSchedules = this.selectedSchedules.filter(id => id != 'All')
        this.shownLeagues = await Promise.all(filteredSelectedSchedules.map(async (leagueId: any) => {
          return await this.fetchLeagueById(leagueId)
        }))
      }
    },
    shownLeagues() {
      this.paginationRefresh = !this.paginationRefresh
    }
  }
})
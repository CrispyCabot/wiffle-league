import { defineComponent } from "@vue/runtime-core";
import { mapActions, mapGetters } from "vuex";
import Pagination from '@/components/navigation/pagination/index.vue'
import PaginationMixin from '@/mixins/pagination-mixin'
import ContentDropdown from '@/components/dropdowns/content-dropdown/index.vue'
import GridTable from '@/components/tables/grid-table/index.vue'

export default defineComponent({
  name: 'schedules',
  components: {
    Pagination,
    ContentDropdown,
    GridTable
  },
  mixins: [ PaginationMixin ],
  data() {
    return {
      selectedSchedules: [],
      shownLeagues: Array<Promise<any>>(),
      columns: [],
      gamesShown:  Array<any>()
    }
  },
  computed: {
    ...mapGetters(['getLoggedInPlayer']),
    splicedLeagues(): Array<Object> {
      return this.shownLeagues.slice(this.startingIndex, this.endingIndex)
    }
  },
  async created() {
    this.columns = await this.fetchLeaguesScheduleTableColumns()
    this.shownLeagues = await this.fetchLeagues()
  },
  methods: {
    ...mapActions([
      'fetchPlayerSelectedSchedules',
      'fetchLeagueById',
      'fetchLeagues',
      'fetchLeaguesScheduleTableColumns',
      'fetchGameById',
      'fetchPlayerById'
    ]),
    findGames(league: any) {
      return this.gamesShown.find((g: any) => g.leagueId == league._id).games
    },
    async loadGames(league: any) {
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
          location: { text: game.game_location, type: 'string-wrap' },
          id: { text: game._id, type: 'hidden' }
        }
      }))

      if (this.gamesShown.includes((g: any) => g.leagueId == league._id)) return

      this.gamesShown.push({
        leagueId: league._id,
        games
      })
    },
    handleGameClick(e: any) {
      this.$router.push(`/games/${e.id}`)
    }
  },
  watch: {
    async getLoggedInPlayer() {
      if (this.getLoggedInPlayer && this.getLoggedInPlayer._id) {
        this.selectedSchedules = await this.fetchPlayerSelectedSchedules(this.getLoggedInPlayer._id)
      }
    },
    async selectedSchedules() {
      if (!this.selectedSchedules) {
        this.shownLeagues = []
        return
      }

      if (this.selectedSchedules.length == 1 && this.selectedSchedules[0] == '*') {
        this.shownLeagues = await this.fetchLeagues()
      } else {
        this.shownLeagues = this.selectedSchedules.filter(id => id == '*').map(async (leagueId: any) => {
          return await this.fetchLeagueById(leagueId)
        })
      }
    }
  }
})
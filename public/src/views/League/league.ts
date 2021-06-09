import { defineComponent } from "@vue/runtime-core";
import { mapActions, mapGetters } from "vuex";
import GridTable from '@/components/tables/grid-table/index.vue'
import { faThemeisle } from "@fortawesome/free-brands-svg-icons";

export default defineComponent({
  name: 'league',
  components: {
    GridTable
  },
  data() {
    return {
      leagueId: '',
      leagueData: Object(),
      creator: Object(),
      leaderboardColumns: [],
      scheduleColumns: [],
      overallStatsColumns: [],
      playersColumns: [
        {columnLabel: 'Name', columnName: 'name', maxWidth: '33vw', isHidden: false},
        {columnLabel: 'Avg', columnName: 'avg', maxWidth: 'unset', isHidden: false},
        {columnLabel: 'Id', columnName: 'id', maxWidth: 'unset', isHidden: true}
      ],
      players: [],
      games: []
    }
  },
  computed: {
    ...mapGetters(['getLoggedInPlayer', 'getIsLoggedIn']),
    isLeagueStarted(): Boolean {
      return this.leagueData ? this.leagueData.games_created : false
    },
    isLoggedInPlayerCreatorOfLeague(): Boolean {
      if (!this.leagueData || !this.leagueData.league_creator_id) return false
      return this.leagueData.league_creator_id == this.getLoggedInPlayer._id && this.getIsLoggedIn
    },
    playersRows(): Array<Object> {
      if (!this.leagueData) return []
      return this.players.map((p: any) => {
        return {
          name: { text: p.firstname + ' ' + p.lastname, type: 'string' },
          avg: { text: this.calcAvg(p), type: 'string' },
          kick: { text: 'Kick Player',  type: this.isLoggedInPlayerCreatorOfLeague ? 'button' : 'hidden' },
          id: { text: p._id, type: 'hidden' }
        }
      })
    }
  },
  async created() {
    this.leagueId = String(this.$route.params.id)
    this.leagueData = await this.fetchLeagueById(this.leagueId)
    this.creator = await this.fetchPlayerById(this.leagueData.league_creator_id)
  },
  methods: {
    ...mapActions([
      'fetchLeagueById',
      'fetchLeagueStatsById',
      'fetchPlayerById',
      'removePlayerFromLeagueGivenId',
      'deleteLeagueById'
    ]),
    async fetchPlayers() {
      this.players = await Promise.all(this.leagueData.player_ids.map(async (id: any) => {
        return await this.fetchPlayerById(id)
      }))
    },
    async fetchGames() {

    },
    calcAvg(player: any) {
      const { hits, plate_appearances } = player.player_stats
      if (hits == 0) return '.000'
      if (hits > plate_appearances) return '.000'

      const avg = String(hits / plate_appearances)
      if (avg.length > 5) return avg.slice(1, 5)
      return avg
    },
    async handleKickPlayerClick(row: any, column: any) {
      this.leagueData = await this.removePlayerFromLeagueGivenId({ playerId: row.id.text, leagueId: this.leagueData._id })
    },
    startLeague() {
      // TODO
    },
    submitScores() {
      // TODO
    },
    async deleteLeague() {
      const res = await this.deleteLeagueById(this.leagueData._id)
      if (res.status === 200) {
        console.log('success')
        this.$router.push('/')
      } else {
        console.log('failure', res.message)
      }
    }
  },
  watch: {
    async leagueData() {
      if (this.leagueData) {
        await this.fetchPlayers()
        await this.fetchGames()
      }
    }
  }
})
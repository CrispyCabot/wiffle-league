import { defineComponent } from "@vue/runtime-core"
import { mapActions, mapGetters, mapMutations } from "vuex"
import GridTable from '@/components/tables/grid-table/index.vue'
import RowCard from '@/components/cards/row-card/index.vue'
import ContactModal from '@/components/popups/contact-modal/index.vue'
import { TOAST_TYPES } from '@/utils/toastTypes'
import Breadcrumb from '@/components/navigation/breadcrumb/index.vue'

export default defineComponent({
  name: 'profile',
  components: {
    GridTable,
    RowCard,
    ContactModal,
    Breadcrumb
  },
  data() {
    return {
      playerID: "",
      player: Object(),
      columns: [],
      leagueColumns: [
        { type: 'string', maxWidth: 'unset' },
        { type: 'string', maxWidth: 'unset' },
        { type: 'string', maxWidth: 'unset' },
        { type: 'string', maxWidth: 'unset' },
        { type: 'string', maxWidth: 'unset' }
        ],
      leagues: [],
      contactModalIsOpen: false,
      loggedInPlayersLeagues: [],
      isInvitingToLeague: false,
      isMobileView: true
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIn', 'getLoggedInPlayer']),
    stats(): any {
      if (!this.player) return {}
      const stats: { [key: string]: any } = { id: { text: this.player._id, type: 'hidden' } }

      if (this.player.player_stats) {
        this.columns.map((c: any) => c.columnName).filter((c: any) => c != 'id').forEach((columnName: string) => {
          if (columnName == 'avg') {
            stats[columnName] = { text: this.calcAvg(this.player.player_stats), type: 'numeric' }
          } else if (columnName == 'slg') {
            stats[columnName] = { text: this.calcSlg(this.player.player_stats), type: 'numeric' }
          } else {
            stats[columnName] = { text: this.player.player_stats[columnName], type: 'numeric' }
          }
        })
      }
      return stats
    },
    row(): Array<Object> {
      if (!this.stats) return []
      return [ this.stats ]
    },
    leagueRows(): Array<Object> {
      if (!this.leagues || this.leagues.length == 0) return []
      if (this.isMobileView)
        return this.leagues
        .map((league: any) => {
          const simple_row = {
            name: {text: league.name, subtitle: '', type: 'title'},
            place: {heading: 'Placement', text: this.getPlayerRankInLeague(this.playerID, league.player_stats), type: 'info'},
            id: {text: league._id, type: 'hidden'}
          }
          return simple_row
        })
      else
        return this.leagues
          .map((league: any) => {
            const simple_row = {
              name: {text: league.name, subtitle: '', type: 'title'},
              points: {heading: 'Points', text: this.getPlayerPoints(this.playerID, league.player_stats), type: 'info'},
              place: {heading: 'Placement', text: this.getPlayerRankInLeague(this.playerID, league.player_stats), type: 'info'},
              record: {heading: "Record", text: this.getPlayerRecord(this.playerID, league.player_stats), type: 'info'},
              id: {text: league._id, type: 'hidden'}
            }
            return simple_row
          })
    },
  },
  async created() {
    this.setIsMobileView()
    window.addEventListener('resize', this.setIsMobileView)
    this.playerID = String(this.$route.params.playerId)
    this.player = await this.fetchPlayerById(this.playerID)
    this.updateCurrentPlayerName(this.player.firstname + ' '  + this.player.lastname)
    if (this.$route.params.leagueId) {
      const league = await this.fetchLeagueById(this.$route.params.leagueId)
      this.updateCurrentLeagueName(league.name)
    }
    this.columns = await this.fetchPlayerStatsTableColumns()
    this.leagues = await Promise.all(this.player.league_ids.map(async (id: string) => {
      const league = await this.fetchLeagueById(id)
      return league
    }))
    if (this.getIsLoggedIn) {
      this.loggedInPlayersLeagues = (await this.fetchPlayerCreatedLeagues(this.getLoggedInPlayer._id)).leagues
    }
  },
  methods: {
    ...mapActions([
      'fetchPlayerStatsTableColumns',
      'updateUserSettings',
      'fetchPlayerById',
      'fetchLeagueById',
      'sendNotification',
      'fetchPlayerCreatedLeagues',
      'invitePlayerToLeague'
    ]),
    ...mapMutations(['updateGlobalToast', 'updateCurrentPlayerName', 'updateCurrentLeagueName']),
    redirect(link: string) {
      if (link == "top") {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }
      else {
        this.$router.push(link)
      }
    },
    toggleContactModal() {
      this.contactModalIsOpen = !this.contactModalIsOpen
    },
    closeContactModal() {
      this.contactModalIsOpen = false
    },
    async sendContactNotification({ message }: any) {
      const playerId = this.player._id
      const notification = {
        senderId: this.getLoggedInPlayer._id,
        leagueId: '',
        gameId: '',
        message: message,
        type: 'ContactRequest'
      }
      const res = await this.sendNotification({ playerId, notification, notificationKey: 'contact_requests' })
      this.updateGlobalToast({
        message: res.message,
        type: res.status == 400 ? TOAST_TYPES.Error : res.status == 403 ? TOAST_TYPES.Warning : TOAST_TYPES.Success,
        duration: 5000,
        isShowing: true
      })
      this.closeContactModal()
    },
    closeInviteToLeague() {
      this.isInvitingToLeague = false
    },
    toggleInviteToLeague() {
      this.isInvitingToLeague = !this.isInvitingToLeague
    },
    async inviteToLeague(league: any) {
      const res = await this.invitePlayerToLeague({ leagueId: league._id, playerId: this.player._id })
      this.closeInviteToLeague()

      this.updateGlobalToast({
        message: res.message,
        type: res.status == 400 ? TOAST_TYPES.Error : res.status == 403 ? TOAST_TYPES.Warning : TOAST_TYPES.Success,
        duration: 5000,
        isShowing: true
      })
    },
    handleLeagueClick(row: any) {
      const id = row.id.text
      this.$router.push(`/league/${id}`)
    },
    getPlayerRankInLeague(playerId: string, leagueStats: Array<Object>) {
      let place = leagueStats.length; //Assume last place, increase it per person with lower score than them
      const playerPoints = this.getPlayerPoints(playerId, leagueStats)
      leagueStats.forEach(function(value: any, index: number) {
        if (value.player_id != playerId && value.stats.points < playerPoints) {
          place -= 1
        }
      })
      let rank = ""
      const placeString = place.toString()
      if (placeString[placeString.length-1] == "1" && placeString != "11")
        rank = placeString + "st"
      else if (placeString[placeString.length-1] == "2" && placeString != "12")
        rank = placeString + "nd"
      else if (placeString[placeString.length-1] == "3" && placeString != "13")
        rank = placeString + "rd"
      else
        rank = placeString + "th"
      return rank;
    },
    getPlayerPoints(playerId: string, leagueStats: Array<Object>) {
      let points = -1
      leagueStats.forEach(function(value: any, index: number) {
        if (value.player_id == playerId) {
          points = value.stats.points
        }
      })
      return points
    },
    getPlayerRecord(playerId: string, leagueStats: Array<Object>) {
      let record = ""
      leagueStats.forEach(function(value: any, index: number) {
        if (value.player_id == playerId) {
          record = value.stats.wins + " - " + value.stats.losses
        }
      })
      return record
    },
    calcAvg(stats: any) {
      const { hits, at_bats } = stats
      if (hits == 0) return '.000'
      if (hits > at_bats) return '.000'

      const avg = String(hits / at_bats)
      if (avg.length > 5) return avg.slice(1, 5)
      return avg
    },
    calcSlg(stats: any) {
      const { hits, singles, doubles, triples, homeruns, at_bats } = stats
      if (hits == 0) return '0'
      if (hits > at_bats) return '0' 
      return String((singles + (2 * doubles) + (3 * triples) + (4 * homeruns)) / at_bats).slice(0, 5)
    },
    setIsMobileView() {
      this.isMobileView = Boolean(window.outerWidth <= 576)
    },
  },
  unmounted() { 
    window.removeEventListener('resize', this.setIsMobileView)
  }
})
import { defineComponent } from "@vue/runtime-core"
import { mapActions, mapGetters } from "vuex"
import GridTable from '@/components/tables/grid-table/index.vue'
import RowCard from '@/components/cards/row-card/index.vue'
import ContactModal from '@/components/popups/contact-modal/index.vue'

export default defineComponent({
  name: 'profile',
  components: {
    GridTable,
    RowCard,
    ContactModal
  },
  data() {
    return {
      playerID: "",
      player: Object(),
      columns: [],
      leagueColumns: ['adsf', 'aasdf', 'asdf', 'alsdkfj'],
      leagues: [],
      leagueRanks: [],
      contactModalIsOpen: false
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIn', 'getLoggedInPlayer']),
    stats(): any {
      if (!this.player) return {}
      const stats: { [key: string]: any } = {}

      if (this.player.player_stats) {
        Object.keys(this.player.player_stats).forEach((s: string) => {
          stats[s] = { text: this.player.player_stats[s], type: 'numeric' } 
        })
      }
      return stats
    },
    row(): Array<Object> {
      if (!this.stats) return []
      return [ this.stats ]
    },
    leagueRows(): Array<Object> {
      return this.leagues
        .map((league: any) => {
          const simple_row = {
            name: {text: league.name, subtitle: '', type: 'title'},
            players: {text: league.player_ids.length + ' / ' + league.max_num_players, type: 'numeric'},
            place: {text: "1st", type: 'numeric'},
            id: {text: league._id, type: 'hidden'}
          }
          return simple_row
        })
    },
  },
  async created() {
    this.playerID = String(this.$route.params.id)
    this.player = await this.fetchPlayerById(this.playerID)
    this.columns = await this.fetchPlayerStatsTableColumns()
    this.leagues = await Promise.all(this.player.league_ids.map(async (id: string) => {
      const league = await this.fetchLeagueById(id)
      return league
    }))
  },
  methods: {
    ...mapActions(['fetchPlayerStatsTableColumns', 'updateUserSettings', 'fetchPlayerById', 'getPlayerRank', 'fetchLeagueById', 'sendNotification']),
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
    async sendContactNotification({ isSending, message, response }: any) {
      const playerId = this.player._id
      const notification = {
        senderId: this.getLoggedInPlayer._id,
        leagueId: '',
        gameId: '',
        message: message,
        type: 'ContactRequest'
      }
      await this.sendNotification({ playerId, notification, notificationKey: 'contact_requests' })
      this.closeContactModal()
    },
    inviteToLeague() {
      alert("To invite this person to a league go talk to them u fkin idiot")
    },
    handleLeagueClick(row: any) {
      const id = row.id.text
      this.$router.push(`/league/${id}`)
    }
  }
})
import { defineComponent } from "@vue/runtime-core"
import GridTable from '@/components/tables/grid-table/index.vue'
import { mapActions, mapGetters } from "vuex"
import contact from "../Contact/contact"

export default defineComponent({
  name: 'profile',
  components: {
    GridTable
  },
  data() {
    return {
      playerID: "",
      player: Object(),
      columns: [],
      leagueColumns: ['Name', 'Points', 'Placement', 'Record']
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
    }
  },
  async created() {
    this.playerID = String(this.$route.params.id)
    this.player = await this.fetchPlayerById(this.playerID)
    this.columns = await this.fetchPlayerStatsTableColumns()
  },
  methods: {
    ...mapActions(['fetchPlayerStatsTableColumns', 'updateUserSettings', 'fetchPlayerById']),
    redirect(link: string) {
      if (link == "top") {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }
      else {
        this.$router.push(link)
      }
    },
    contact() {
      alert("To contact this person go talk to them u fkin idiot")
    },
    inviteToLeague() {
      alert("To invite this person to a league go talk to them u fkin idiot")
    }
  }
})
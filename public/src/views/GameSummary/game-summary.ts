import { defineComponent } from "@vue/runtime-core";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: 'game-summary',
  data() {
    return {
      gameId: '',
      gameData: Object(),
      team1: Array<Object>(),
      team2: Array<Object>(),
      fields: {
        plate_appearances: {text: 'Plate Appearances', value: null },
        single: {text: 'Singles', value: null },
        double: {text: 'Doubles', value: null },
        triple: {text: 'Triples', value: null },
        homerun: {text: 'Home Runs', value: null }
      }
    }
  },
  computed: {
    ...mapGetters(['getLoggedInPlayer']),
    gameIsCompleted(): Boolean {
      return this.gameData.completed
    },
    playerIsInGame(): Boolean {
      if (!this.gameData || !this.gameData.team_1_ids || !this.gameData.team_2_ids || !this.getLoggedInPlayer) return false
      return this.gameData.team_1_ids.includes(this.getLoggedInPlayer._id) || this.gameData.team_2_ids.includes(this.getLoggedInPlayer._id)
    }
  },
  async created() {
    this.gameId = String(this.$route.params.id)
    this.gameData = await this.fetchGameById(this.gameId)

    this.team1 = await Promise.all(this.gameData.team_1_ids.map(async (id: any) => await this.fetchPlayerById(id)))
    this.team2 = await Promise.all(this.gameData.team_2_ids.map(async (id: any) => await this.fetchPlayerById(id)))
  },
  methods: {
    ...mapActions(['fetchGameById', 'fetchPlayerById'])
  }
})
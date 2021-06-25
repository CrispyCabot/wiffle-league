import { defineComponent } from "vue";
import MultiItemSelector from '@/components/dropdowns/multi-item-selector/index.vue'
import { mapActions, mapMutations } from "vuex"
import { TOAST_TYPES } from '@/utils/toastTypes'

export default defineComponent({
  name: 'game-selection-modal',
  components: {
    MultiItemSelector
  },
  props: {
    gameCount: { type: Number, default: 0 },
    players: { type: Array, default: () => [] },
    teamSize: { type: Number, default: 0 }
  },
  data() {
    return {
      games: new Array(),
      currGameNum: 1,
      currentGame: Object(),
      searchText: ''
    }
  },
  computed: {
    unselectedPlayers(): Array<any> {
      if (!this.players || this.players.length === 0) return []
      const filteredPlayers = this.players.filter((p: any) => p._id && (!this.currentGame.team1Selections.map((p: any) => p._id).includes(p._id) && !this.currentGame.team2Selections.map((p: any) => p._id).includes(p._id)))
      if (this.searchText) {
        return filteredPlayers.filter((p: any) => p.firstname.slice(0, this.searchText.length).toLowerCase() == this.searchText.toLowerCase())
      }
      return filteredPlayers
    },
    areAllGamesSubmitted(): Boolean {
      return this.games.filter((g: any) => {
        return !(
          g.team1Selections.length == this.teamSize &&
          g.team2Selections.length == this.teamSize &&
          g.date &&
          g.time &&
          g.location
        )
      }).length === 0
    }
  },
  created() {
    for (let i = 1; i <= this.gameCount; i++) {
      const team1Selections: Array<Object> = []
      const team2Selections: Array<Object> = []
      while (team1Selections.length !== this.teamSize) {
        const randomPlayer: any = this.players[Math.floor(Math.random() * this.players.length)]
        if (!team1Selections.map((p: any) => p._id).includes(randomPlayer._id)) {
          team1Selections.push(randomPlayer)
        }
      }
      while (team2Selections.length !== this.teamSize) {
        const randomPlayer: any = this.players[Math.floor(Math.random() * this.players.length)]
        if (!team1Selections.map((p: any) => p._id).includes(randomPlayer._id) && !team2Selections.map((p: any) => p._id).includes(randomPlayer._id)) {
          team2Selections.push(randomPlayer)
        }
      }
      this.games.push({
        game_num: i,
        team1Selections,
        team2Selections,
        date: null,
        time: null,
        location: null
      })
    }

    this.setCurrentGame()
  },
  mounted() {
    const html = document.querySelector('html')
    if (html) {
      html.style.overflowY = 'hidden'
    }
  },
  beforeUnmount() {
    const html = document.querySelector('html')
    if (html) {
      html.style.overflowY = 'scroll'
    }
  },
  methods: {
    ...mapActions(['createGames']),
    ...mapMutations(['updateGlobalToast']),
    nextGame() {
      if (this.currGameNum == this.games.length) return
      this.currGameNum += 1
    },
    prevGame() {
      if (this.currGameNum == 1) return
      this.currGameNum -= 1
    },
    setCurrentGame() {
      this.currentGame = this.games.find((g: any) => g.game_num == this.currGameNum)
    },
    team1Selection(item: any) {
      const player: any = this.players.find((p: any) => p._id === item.id)
      if (this.currentGame.team1Selections.map((p: any) => p._id).includes(player._id)) {
        this.currentGame.team1Selections = this.currentGame.team1Selections.filter((p: any) => p._id !== player._id)
      } else {
        if (this.currentGame.team1Selections.length >= this.teamSize) return
        this.currentGame.team1Selections.push(player)
      }
    },
    team2Selection(item: any) {
      const player: any = this.players.find((p: any) => p._id === item.id)
      if (this.currentGame.team2Selections.map((p: any) => p._id).includes(player._id)) {
        this.currentGame.team2Selections = this.currentGame.team2Selections.filter((p: any) => p._id !== player._id)
      } else {
        if (this.currentGame.team2Selections.length >= this.teamSize) return
        this.currentGame.team2Selections.push(player)
      }
    },
    async startLeague() {
      const mappedGames = this.games.map((g: any) => {
        return {
          league_id: this.$route.params.leagueId,
          team_1_ids: g.team1Selections.map((p: any) => p._id),
          team_2_ids: g.team2Selections.map((p: any) => p._id),
          game_date: new Date(g.date + ', ' + g.time),
          game_location: g.location,
          completed: false,
          team_1_score: 0,
          team_2_score: 0,
          player_stats: []
        }
      })
      const res = await this.createGames(mappedGames)
      if (res.status === 200) {
        this.$emit('games-created', res.league, res.games)
      }
      this.updateGlobalToast({
        message: res.message,
        type: res.status == 400 ? TOAST_TYPES.Error : res.status == 403 ? TOAST_TYPES.Warning : TOAST_TYPES.Success,
        duration: 5000,
        isShowing: true
      })
    },
    searchValueChange(searchText: string) {
      this.searchText = searchText
    }
  },
  watch: {
    currGameNum() {
      if (this.games && this.games.length > 0) {
        this.setCurrentGame()
      }
    }
  }
})
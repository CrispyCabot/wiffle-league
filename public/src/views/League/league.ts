import { defineComponent } from "@vue/runtime-core";
import { setup } from "vue-class-component";
import { mapActions } from "vuex";

export default defineComponent({
  name: 'league',
  data() {
    return {
      leagueId: '',
      leagueData: null,
      leagueStatsData: null
    }
  },
  async created() {
    this.leagueId = String(this.$route.params.id)
    this.leagueData = await this.fetchLeagueById(this.leagueId)
  },
  methods: {
    ...mapActions(['fetchLeagueById', 'fetchLeagueStatsById'])
  }
})
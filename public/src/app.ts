import Navbar from '@/components/navigation/navbar/index.vue'
import Footer from '@/components/navigation/footer/index.vue'
import { mapActions, mapMutations } from 'vuex'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'app',
  components: {
    Navbar,
    Footer
  },
  async created() {
    const res = await this.retrieveRefreshToken()
    console.log('token refreshed', res)
    if (res.ok) {
      this.updateIsLoggedIn(true)
      this.updateLoggedInPlayer(res.user)
    }
  },
  methods: {
    ...mapActions(['retrieveRefreshToken']),
    ...mapMutations(['updateIsLoggedIn', 'updateLoggedInPlayer'])
  }
})
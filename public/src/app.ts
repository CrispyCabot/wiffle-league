import api from '@/api/api'
import Navbar from '@/components/navigation/navbar/index.vue'
import Footer from '@/components/navigation/footer/index.vue'
import Toast from '@/components/popups/toast/index.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'app',
  components: {
    Navbar,
    Footer,
    Toast
  },
  async created() {
    const res = await this.retrieveRefreshToken()
    console.log('token refreshed', res)
    if (res.ok) {
      this.updateIsLoggedIn(true)
      this.updateLoggedInPlayer(res.user)
      api.defaults.headers.common['Authorization'] = `Bearer ${res.accessToken}`
    }
  },
  computed: {
    ...mapGetters(['getGlobalToastMessage', 'getGlobalToastType', 'getGlobalToastIsShowing', 'getGlobalToastDuration'])
  },
  methods: {
    ...mapActions(['retrieveRefreshToken']),
    ...mapMutations(['updateIsLoggedIn', 'updateLoggedInPlayer', 'updateGlobalToast']),
    closingGlobalToast() {
      if (this.getGlobalToastIsShowing) {
        this.updateGlobalToast({
          message: '',
          type: '',
          duration: '',
          isShowing: false
        })
      }
    }
  }
})
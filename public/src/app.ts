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
  data() {
    return {
      isMobileView: true,
      isMaxViewportHeight: true
    }
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
  mounted() {
    this.setIsMobileView()
    window.addEventListener('resize', this.setIsMobileView)
    this.setIsMaxViewportHeight()
    window.addEventListener('resize', this.setIsMaxViewportHeight)  
  },
  updated() {
    this.setIsMobileView()
    this.setIsMaxViewportHeight()
  },
  computed: {
    ...mapGetters(['getGlobalToastMessage', 'getGlobalToastType', 'getGlobalToastIsShowing', 'getGlobalToastDuration', 'getGlobalToastIsShowingOverride', 'getAccessToken'])
  },
  methods: {
    ...mapActions(['retrieveRefreshToken']),
    ...mapMutations(['updateIsLoggedIn', 'updateLoggedInPlayer', 'updateGlobalToast']),
    closingGlobalToast() {
      if (this.getGlobalToastIsShowing) {
        this.updateGlobalToast({
          isShowing: false
        })
      }
    },
    setIsMobileView() {
      this.isMobileView = Boolean(window.outerWidth <= 576)
    },
    setIsMaxViewportHeight() {
      const routerView = this.$refs.router_view as any
      const routerViewBounds = routerView.getBoundingClientRect()
      const footerSpan = this.$refs.footer_element as any
      const footerBounds = footerSpan.children[0].getBoundingClientRect()
      this.isMaxViewportHeight = Boolean((routerViewBounds.height + footerBounds.height) >= window.outerHeight )
      if (!this.isMaxViewportHeight) {
        routerView.style.paddingBottom = footerBounds.height + 'px'
      }
    }
  },
  unmounted() { 
    window.removeEventListener('resize', this.setIsMobileView)
    window.removeEventListener('resize', this.setIsMaxViewportHeight)
  },
  watch: {
    $route() {
      if (this.getAccessToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${this.getAccessToken}`
      }
    }
  }
})
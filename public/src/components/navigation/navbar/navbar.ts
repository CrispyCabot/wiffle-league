import { defineComponent } from "@vue/runtime-core"
import Links from '@/utils/links'
import Hamburger from '@/components/navigation/hamburger/index.vue'
import UserPopup from '@/components/popups/user-popup/index.vue'

export default defineComponent({
  name: 'navbar',
  components: {
    Hamburger,
    UserPopup
  },
  data() {
    return {
      links: Links,
      isUserPopupOpen: false,
      isMobileView: true
    }
  },
  computed: {},
  created() {
    this.setIsMobileView()
    window.addEventListener('resize', this.setIsMobileView)
  },
  updated() {
    this.setIsMobileView()
  },
  methods: {
    closeUserPopup() {
      this.isUserPopupOpen = false
    },
    toggleUserPopup() {
      this.isUserPopupOpen = !this.isUserPopupOpen
    },
    setIsMobileView() {
      this.isMobileView = Boolean(window.outerWidth <= 576)
    },
    redirect(link: any) {
      this.$router.push(link.redirect)
    }
  },
  unmounted() { 
    window.removeEventListener('resize', this.setIsMobileView)
  }
})
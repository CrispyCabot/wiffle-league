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
      isUserPopupOpen: false
    }
  },
  computed: {
    isMobileView() {
      return Boolean(window.outerWidth <= 576)
    }
  },
  methods: {
    closeUserPopup() {
      this.isUserPopupOpen = false
    },
    toggleUserPopup() {
      this.isUserPopupOpen = !this.isUserPopupOpen
    }
  }
})
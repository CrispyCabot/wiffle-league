import { defineComponent } from "@vue/runtime-core"
import Links from '@/utils/links'
import Hamburger from '@/components/navigation/hamburger/index.vue'

export default defineComponent({
  name: 'navbar',
  components: {
    Hamburger
  },
  data() {
    return {
      links: Links
    }
  },
  computed: {
    isMobileView() {
      return Boolean(window.outerWidth <= 576)
    }
  }
})
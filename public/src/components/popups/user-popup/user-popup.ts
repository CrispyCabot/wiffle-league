import { defineComponent } from "@vue/runtime-core";
import { mapGetters, mapMutations } from "vuex";

export default defineComponent({
  name: 'user-popup',
  props: {
    alignment: { type: String, default: 'right' }
  },
  computed: {
    ...mapGetters(['getIsLoggedIn'])
  },
  methods: {
    ...mapMutations(['updateIsLoggedIn', 'updateLoggedInPlayer']),
    redirectLink(link: string) {
      if (link == '/logout') {
        this.updateIsLoggedIn(false)
        this.updateLoggedInPlayer({})
        this.$router.push('/login')
        return
      }
      this.$router.push(link)
      this.$emit('link-click')
    }
  }
})
import { defineComponent } from "@vue/runtime-core";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default defineComponent({
  name: 'user-popup',
  props: {
    alignment: { type: String, default: 'right' }
  },
  computed: {
    ...mapGetters(['getIsLoggedIn'])
  },
  methods: {
    ...mapActions(['logPlayerOut']),
    ...mapMutations(['updateIsLoggedIn', 'updateLoggedInPlayer']),
    async redirectLink(link: string) {
      if (link == '/logout') {
        await this.logPlayerOut()
        this.$router.push('/login')
      } else {
        this.$router.push(link)
      }
      this.$emit('link-click')
    }
  }
})
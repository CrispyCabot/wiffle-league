import { defineComponent } from "@vue/runtime-core";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default defineComponent({
  name: 'user-popup',
  props: {
    alignment: { type: String, default: 'right' }
  },
  computed: {
    ...mapGetters(['getIsLoggedIn', 'getLoggedInPlayer']),
    notificationCount(): Number {
      let count = 0
      if (this.getLoggedInPlayer && this.getLoggedInPlayer.notifications) {
        Object.keys(this.getLoggedInPlayer.notifications).map((key: any) => {
          count += this.getLoggedInPlayer.notifications[key].notifications.length
        })
      }
      return count
    }
  },
  methods: {
    ...mapActions(['logPlayerOut']),
    ...mapMutations(['updateIsLoggedIn', 'updateLoggedInPlayer']),
    async redirectLink(link: string) {
      this.$emit('link-click')

      if (link == '/logout') {
        await this.logPlayerOut()
      } else if (link == '/login') {
        this.$router.push(`${link}?redirect=${encodeURIComponent(this.$route.path)}`)
      } else {
        this.$router.push(link)
      }
    }
  }
})
import { defineComponent } from "@vue/runtime-core";
import { mapGetters } from "vuex";

export default defineComponent({
  name: 'user-popup',
  props: {
    alignment: { type: String, default: 'right' }
  },
  computed: {
    ...mapGetters(['getIsLoggedIn'])
  },
  methods: {
    redirectLink(link: string) {
      this.$router.push(link)
      this.$emit('link-click')
    }
  }
})
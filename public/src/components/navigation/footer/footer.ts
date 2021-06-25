import { defineComponent } from "@vue/runtime-core"
import { mapGetters } from "vuex";

export default defineComponent({
  name: 'footer',
  props: {
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['getIsLoggedIn', 'getLogo'])
  },
  methods: {
    redirect(link: string) {
      if (link == "top") {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }
      else {
        this.$router.push(link)
      }
    }
  }
})
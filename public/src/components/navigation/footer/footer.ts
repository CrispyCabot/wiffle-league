import { defineComponent } from "@vue/runtime-core"

export default defineComponent({
  name: 'footer',
  props: {
  },
  data() {
    return {
    }
  },
  methods: {
    redirect(link: string) {
      if (link == "top") {
        window.scrollTo(0, 0);
      }
      else {
        this.$router.push(link)
      }
    }
  }
})
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
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }
      else {
        this.$router.push(link)
      }
    }
  }
})
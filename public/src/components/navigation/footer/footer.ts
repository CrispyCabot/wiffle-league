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
      console.log("clicked");
      this.$router.push(link)
    }
  }
})
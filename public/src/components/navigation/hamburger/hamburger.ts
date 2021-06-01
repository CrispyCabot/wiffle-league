import { defineComponent } from "@vue/runtime-core"

export default defineComponent({
  name: 'hamburger',
  props: {
    links: { type: Array, default: () => { return [] } }
  },
  data() {
    return {
      isLinksOpen: false
    }
  },
  methods: {
    closeLinks() {
      this.isLinksOpen = false
    },
    toggleLinks() {
      this.isLinksOpen = !this.isLinksOpen
    },
    redirectLink(link: any) {
      this.$router.push(link.redirect)
      this.closeLinks()
    }
  }
})
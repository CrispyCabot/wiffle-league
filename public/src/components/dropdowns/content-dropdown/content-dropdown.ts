import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: 'content-dropdown',
  props: {
    label: { type: String, default: '' },
    iconClass: { type: String, default: '' }
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    closeIsOpen() {
      this.isOpen = false
    },
    toggleIsOpen() {
      this.isOpen = !this.isOpen
    }
  }
})
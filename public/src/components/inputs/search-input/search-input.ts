import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: 'search-input',
  data() {
    return {
      searchValue: ''
    }
  },
  methods: {
    focusInput() {
      const input = document.getElementById('search_input')
      if (input) input.focus()
    },
    valueChange() {
      this.$emit('search-value-change', this.searchValue)
    }
  }
})
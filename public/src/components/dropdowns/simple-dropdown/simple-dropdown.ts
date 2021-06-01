import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: 'simple-dropdown',
  props: {
    items: { type: Array, default: () => [] },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    selectedItem: null
  },
  data() {
    return {
      isCollapsed: true
    }
  },
  methods: {
    closeContent() {
      this.isCollapsed = true
    },
    toggleContent() {
      this.isCollapsed = !this.isCollapsed
    },
    selectItem(item: any) {
      this.closeContent()
      this.$emit('select-item', item)
    }
  }
})
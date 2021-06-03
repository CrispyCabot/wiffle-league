import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: 'row-card',
  props: {
    row: { type: Object, default: () => {} },
    columns: { type: Array, default: () => [] },
    hasArrowIcon: { type: Boolean, default: true }
  }
})
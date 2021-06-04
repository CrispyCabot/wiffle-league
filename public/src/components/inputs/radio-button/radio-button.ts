import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: 'radio-button',
  props: {
    button: { type: String, default: '' },
    isSelected: { type: Boolean, default: false }
  }
})
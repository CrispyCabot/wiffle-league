import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: 'radio-slider',
  props: {
    values: { type: Array, default: () => [] },
    selectedValue: { type: [String, Boolean], default: '' },
    showLabel: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false }
  },
  computed: {
    getSelectedValueIndex(): number {
      return this.values.findIndex(v => v == this.selectedValue)
    },
    getUnSelectedValueIndex(): number {
      return this.values.findIndex(v => v != this.selectedValue)
    }
  },
  methods: {
    changeSelectedValue() {
      this.$emit('value-change', this.values[this.getUnSelectedValueIndex])
    }
  }
})
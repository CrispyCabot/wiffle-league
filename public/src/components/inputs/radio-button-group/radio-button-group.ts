import { defineComponent } from "@vue/runtime-core";
import RadioButton from '@/components/inputs/radio-button/index.vue'
import { stringifyQuery } from "vue-router";

export default defineComponent({
  name: 'radio-button-group',
  components: {
    RadioButton
  },
  props: {
    buttons: {type: Array, default: () => []},
    selectedRadioButton: {type: String, default: ''}
  },
  methods: {
    radioButtonClick(button: string) {
      if (button == this.selectedRadioButton) return
      this.$emit('radio-button-change', button)
    }
  }
})
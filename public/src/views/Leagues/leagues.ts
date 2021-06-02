import { defineComponent } from "@vue/runtime-core";
import SearchInput from '@/components/inputs/search-input/index.vue'
import RadioSlider from '@/components/inputs/radio-slider/index.vue'

export default defineComponent({
  name: 'leagues',
  components: {
    SearchInput,
    RadioSlider
  },
  data() {
    return {
      searchValue: '',
      displayValues: ['Detailed', 'Simple'],
      selectedDisplayValue: 'Detailed'
    }
  },
  methods: {
    searchValueChange(value: string) {
      this.searchValue = value
    },
    displayViewChange(view: string) {
      this.selectedDisplayValue = view
    }
  }
})
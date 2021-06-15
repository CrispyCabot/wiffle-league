import { defineComponent } from "@vue/runtime-core";
import SearchInput from '@/components/inputs/search-input/index.vue'

export default defineComponent({
  name: 'multi-item-selector',
  props: {
    selectedItems: { type: Array, default: () => [] },
    label: { type: String, default: '' },
    items: { type: Array, default: () => [] },
    overrideText: { type: String, default: '' },
    itemMaxCharacters: { type: Number, default: 100000000 }
  },
  components: {
    SearchInput
  },
  data() {
    return {
      isPopupOpen: false
    }
  },
  computed: {
    selections(): string {
      return this.selectedItems.map((i: any) => {
        let slice = i.text.slice(0, this.itemMaxCharacters)
        if (i.text.length >= this.itemMaxCharacters) slice = slice + '...'
        return slice
      }).join(', ')
    }
  },
  methods: {
    closePopup() {
      this.isPopupOpen = false
    },
    togglePopup() {
      this.isPopupOpen = !this.isPopupOpen
    }
  }
})
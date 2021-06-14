import { defineComponent } from "@vue/runtime-core";
import Pagination from '@/components/navigation/pagination/index.vue'

export default defineComponent({
  name: 'grid-table',
  components: {
    Pagination
  },
  props: {
    columns: { type: Array, default: () => [] },
    hasHeader: { type: Boolean, default: true },
    rows: { type: Array, default: () => [] },
    rowsCount: { type: Number, default: 0 },
    label: { type: String, default: '' },
    title: { type: String, default: '' },
    hasPagination: { type: Boolean, default: false },
    pageIndex: { type: Number, default: 0 },
    pageSize: { type: Number, default: 4 },
    hasSizeSelector: { type: Boolean, default: false },
    paginationRefresh: { type: Boolean, default: true },
    canHideContent: { type: Boolean, default: false },
    clickable: { type: Boolean, default: true }
  },
  data() {
    return {
      isContentOpen: false
    }
  },
  methods: {
    toggleIsContentOpen() {
      if (this.canHideContent) {
        this.isContentOpen = !this.isContentOpen
      }
    },
    locationClick(row: any, col: any) {
      window.open(`https://www.google.com/maps/search/${col.text.split(' ').join('+')}`)
    }
  }
})
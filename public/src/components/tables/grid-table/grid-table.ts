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
    hasSizeSelector: { type: Boolean, default: false }
  }
})
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: 'grid-table',
  props: {
    columns: { type: Array, default: () => [] },
    hasHeader: { type: Boolean, default: true },
    rows: { type: Array, default: () => [] },
    label: { type: String, default: '' },
    title: { type: String, default: '' },
    hasPagination: { type: Boolean, default: true },
    pageIndex: { type: Number, default: 0 },
    pageSize: { type: Number, default: 10 },
    startingPage: { type: Number, default: 1 },
    endingPage: { type: Number, default: 1 }
  },
  computed: {
    pageCount(): Number {
      return Math.ceil(this.rows.length / this.pageSize)
    }
  }
})
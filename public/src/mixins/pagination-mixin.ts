import { defineComponent } from "@vue/runtime-core"

export default defineComponent({
  name: 'pagination-mixin',
  data() {
    return {
      hasPagination: true,
      hasSizeSelector: true,
      pageIndex: 0,
      pageSize: 4,
      startingIndex: 0,
      endingIndex: 4
    }
  },
  created() {
    this.endingIndex = this.startingIndex + this.pageSize
  },
  methods: {
    changePageIndex(pageIndex: number) {
      this.pageIndex = pageIndex
      this.startingIndex = pageIndex * this.pageSize
      this.endingIndex = this.startingIndex + this.pageSize
    },
    changePageSize(pageSize: number) {
      this.pageSize = pageSize
      this.endingIndex = this.startingIndex + this.pageSize
    }
  }
})
import { defineComponent } from "@vue/runtime-core";
import SimpleDropdown from '@/components/dropdowns/simple-dropdown/index.vue'

export default defineComponent({
  name: 'pagination',
  components: {
    SimpleDropdown
  },
  props: {
    totalItemCount: { type: Number, default: 0 },
    pageIndex: { type: Number, default: 0 },
    pageSize: { type: Number, default: 4 },
    hasSizeSelector: { type: Boolean, default: false },
    maxPagesDisplayed: { type: Number, default: 4 }
  },
  data() {
    return {
      startingPage: 1,
      endingPage: 4,
      pageSizes: [1, 2, 3, 4, 5, 10, 25, 50]
    }
  },
  computed: {
    maxPageCount(): number {
      return Math.ceil(this.totalItemCount / this.pageSize)
    },
    displayedPageCount(): number {
      return this.maxPageCount > this.maxPagesDisplayed 
        ? this.maxPagesDisplayed
        : this.maxPageCount
    }
  },
  mounted() {
    this.endingPage = this.displayedPageCount
  },
  methods: {
    pageIndexChange(i: Number) {
      this.$emit('page-index-change', i)
    },
    pageStartChange() {
      if (this.startingPage > 1) {
        this.startingPage--
        this.endingPage--
      }
    },
    pageEndChange() {
      if (this.endingPage < this.totalItemCount) {
        this.startingPage++
        this.endingPage++
      }
    },
    pageSizeSelection(pageSize: any) {
      this.$emit('page-size-change', pageSize)
    }
  },
  watch: {
    pageSize() {
      if (Math.ceil(this.totalItemCount / this.pageSize) < this.pageIndex) {
        this.$emit('page-index-change', Math.ceil(this.totalItemCount / this.pageSize) - 1)
        this.endingPage = Math.ceil(this.totalItemCount / this.pageSize)
        this.startingPage = this.endingPage - this.displayedPageCount >= 1 ? this.endingPage - this.displayedPageCount : 1
      } else if (this.endingPage > this.maxPageCount) {
        this.endingPage = Math.ceil(this.totalItemCount / this.pageSize)
        this.startingPage = this.endingPage - this.displayedPageCount >= 1 ? this.endingPage - this.displayedPageCount : 1
      } else {
        this.endingPage = (this.startingPage - 1) + this.displayedPageCount
      }
    }
  }
})
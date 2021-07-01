import { defineComponent } from "@vue/runtime-core";
import Pagination from '@/components/navigation/pagination/index.vue'
import SortingIcons from '@/utils/sortingIcons'

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
    hoverable: { type: Boolean, default: true },
    sortingColumnOverride: { type: null as any, default: null },
    sortingDirectionOverride: { type: null as any, default: null },
    isLoading: { type: Boolean, default: false }
  },
  data() {
    return {
      isContentOpen: false,
      sortingColumn: null as any,
      sortingDirection: null as any
    }
  },
  computed: {
    getSortingIcon() {
      return (column: any) => {
        if (!this.sortingColumn || !column) return SortingIcons.SORTING

        if (this.sortingColumn.columnName == column.columnName) {
          if (this.sortingDirection) return this.sortingDirection
          return SortingIcons.SORTING_UP
        }

        return SortingIcons.SORTING
      }
    }
  },
  created() {
    if (this.sortingColumnOverride && this.sortingDirectionOverride) {
      this.sortingColumn = this.sortingColumnOverride
      this.sortingDirection = this.sortingDirectionOverride
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
    },
    handleSortingColumnChange(column: any) {
      if (this.sortingColumn && column) {
        if (this.sortingColumn.columnName == column.columnName) {
          if (this.sortingDirection == SortingIcons.SORTING_UP) {
            this.sortingDirection = SortingIcons.SORTING_DOWN  
          } else {
            this.sortingDirection = SortingIcons.SORTING_UP
          }
        } else {
          this.sortingDirection = SortingIcons.SORTING_UP
        }
      } else {
        this.sortingDirection = SortingIcons.SORTING_UP
      }
      this.sortingColumn = column
      const directionString = (this.sortingDirection == SortingIcons.SORTING_UP) || !this.sortingDirection ? 'up' : 'down'
      this.$emit('sort-change', {column: this.sortingColumn, direction: directionString })
    }
  }
})
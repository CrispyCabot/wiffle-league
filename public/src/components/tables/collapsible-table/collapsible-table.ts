import { defineComponent } from "@vue/runtime-core";
import Pagination from '@/components/navigation/pagination/index.vue'
import { VueDraggableNext } from "vue-draggable-next";

export default defineComponent({
  name: 'collapsible-table',
  components: {
    draggable: VueDraggableNext,
    Pagination
  },
  props: {
    sections: { type: Array, default: () => [] },
    title: { type: String, default: '' },
    hoverable: { type: Boolean, default: true }
  },
  data() {
    return {
      mutableSections: new Array(),
      isMobileView: true
    }
  },
  computed: {
    getHandle(): String {
      if (this.isMobileView) {
        return '.drag-grip-icon'
      }
      return '.collapsible-table_table_body_row-header_grip'
    }
  },
  created() {
    window.addEventListener('resize', this.resizeTable)
  }, 
  updated() {
    this.setIsMobileView()
    this.resizeTable()
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeTable)
  }, 
  methods: {
    setIsMobileView() {
      this.isMobileView = Boolean(window.outerWidth <= 576)
    },
    resizeTable() {
      this.setIsMobileView()
      const elmContainer: any = this.$refs.collapsible_table_container
      const elmContainerBounds: any = elmContainer.getBoundingClientRect()

      const elmTable: any = this.$refs.collapsible_table
      const elmBody: any = this.$refs.collapsible_table_body
      if (!elmTable || !elmBody) return
      elmTable.style.maxWidth = elmContainerBounds.width + 'px'
      elmBody.style.width = elmContainerBounds.width - 4 + 'px'
      elmBody.querySelector('.draggable-sections').style.width = elmContainerBounds.width - 4 + 'px'
      elmBody.querySelectorAll('.collapsible-table_table_body_row-group').forEach((e: any) => {
        e.style.width = elmBody.width + 'px'
      })
    }
  },
  watch: {
    sections() {
      this.mutableSections = this.sections
    },
    mutableSections() {
      this.$emit('sections-mutated', this.mutableSections)
    }
  }
})
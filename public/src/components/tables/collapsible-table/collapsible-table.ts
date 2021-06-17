import { defineComponent } from "@vue/runtime-core";
import Pagination from '@/components/navigation/pagination/index.vue'

export default defineComponent({
  name: 'collapsible-table',
  components: {
    Pagination
  },
  props: {
    sections: { type: Array, default: () => [] },
    label: { type: String, default: '' },
    title: { type: String, default: '' },
    hoverable: { type: Boolean, default: true }
  },
  data() {
    return {}
  },
  methods: {
  }
})
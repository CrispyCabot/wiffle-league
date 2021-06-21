import { defineComponent } from "vue"
import { TOAST_TYPES } from '@/utils/toastTypes'

export default defineComponent({
  name: 'toast',
  props: {
    message: { type: String, default: '' },
    type: { type: String, default: TOAST_TYPES.Success },
    duration: { type: Number, default: 5000 },
    isShowing: { type: Boolean, default: false }
  },
  data() {
    return {
    }
  },
  computed: {
    toastTypeIcon(): Array<string> {
      if (this.type === TOAST_TYPES.Error) {
        return ['fas', 'exclamation-triangle']
      } else if (this.type === TOAST_TYPES.Success) {
        return ['fas', 'thumbs-up']
      } else if (this.type === TOAST_TYPES.Info) {
        return ['fas', 'info']
      } else if (this.type === TOAST_TYPES.Warning) {
        return ['fas', 'exclamation-triangle']
      }

      return []
    }
  },
  created() {
    setTimeout(() => {
      this.close()
    }, this.duration)
  },
  unmounted() {
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
})
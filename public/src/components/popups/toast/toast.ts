import { defineComponent } from "vue"
import { TOAST_TYPES } from '@/utils/toastTypes'

export default defineComponent({
  name: 'toast',
  props: {
    message: { type: String, default: '' },
    type: { type: String, default: TOAST_TYPES.Success },
    duration: { type: Number, default: 5000 },
    isShowing: { type: Boolean, default: false },
    isShowingOverride: { type: Number, default: 0 }
  },
  data() {
    return {
      timer: null as any,
      slider: 100,
      intervalRate: 10
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
    this.startInterval()
  },
  beforeUnmount() {
    this.slider = 100
    clearInterval(this.timer)
  },
  methods: {
    close() {
      this.$emit('close')
    },
    startInterval() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.slider -= (100 / (this.duration / this.intervalRate))
        if (this.slider <= 0) {
          this.close()
        }
      }, this.intervalRate)
    }
  }
})
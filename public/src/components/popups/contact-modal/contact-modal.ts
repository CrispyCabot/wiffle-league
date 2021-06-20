import { defineComponent } from "vue";

export default defineComponent({
  name: 'contact-modal',
  props: {
    isSending: { type: Boolean, default: true },
    player: { type: Object, default: () => {} },
    messageOverride: { type: String, default: '' },
  },
  data() {
    return {
      message: '',
      response: ''
    }
  },
  created() {
    const html = document.querySelector('html')
    if (html) {
      html.style.overflowY = 'hidden'
    }

    if (this.messageOverride) this.message = this.messageOverride
  },
  unmounted() {
    const html = document.querySelector('html')
    if (html) {
      html.style.overflowY = 'scroll'
    }
  },
  computed: {
    canSend(): Boolean {
      return Boolean((this.isSending && this.message) || (!this.isSending && this.response))
    }
  },
  methods: {
    sendContactForm() {
      if (this.canSend) {
        this.$emit('send', { isSending: this.isSending, message: this.message, response: this.response })
      }
    }
  },
  watch: {
    messageOverride() {
      this.message = this.messageOverride
    }
  }
})
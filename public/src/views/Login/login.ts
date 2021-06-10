import { defineComponent } from "@vue/runtime-core";
import RadioButtonGroup from '@/components/inputs/radio-button-group/index.vue'
import { mapActions, mapMutations } from "vuex";

export default defineComponent({
  name: 'login',
  components: {
    RadioButtonGroup
  },
  data() {
    return {
      fields: {
        email: { value: '', placeholder: 'Email', name: 'email', isRequired: true  },
        password: { value: '', placeholder: 'Password', name: 'password', isRequired: true  }
      },
      genderRadioButtons: [
        'Male',
        'Female',
        'Other'
      ]
    }
  },
  computed: {
    enabledLoginButton(): Boolean {
      return Boolean(
        this.fields.email.value && 
        this.validEmail && 
        this.fields.password.value &&
        this.validPassword
      )
    },
    validEmail(): Boolean {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.fields.email.value).toLowerCase()) || this.fields.email.value == ''
    },
    validPassword(): Boolean {
      return (this.fields.password.value.length >= 6) || this.fields.password.value == ''
    }
  },
  methods: {
    ...mapActions(['logPlayerIn']),
    ...mapMutations(['updateIsLoggedIn', 'updateLoggedInPlayer']),
    async login() {
      const res = await this.logPlayerIn({
        email: this.fields.email.value,
        password: this.fields.password.value
      })
      if (res.status == 400) {
        console.log('Error')
      } else if (res.status == 200) {
        this.updateIsLoggedIn(true)
        this.updateLoggedInPlayer(res.player)
        if (this.$route.query.redirect && this.$route.query.redirect != '/signup') {
          this.$router.push(decodeURIComponent(String(this.$route.query.redirect)))
        } else {
          this.$router.push('/')
        }
      }
    }
  }
})
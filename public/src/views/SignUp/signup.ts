import { defineComponent } from "@vue/runtime-core";
import RadioButtonGroup from '@/components/inputs/radio-button-group/index.vue'
import { mapActions, mapMutations } from "vuex"
import { TOAST_TYPES } from '@/utils/toastTypes'

export default defineComponent({
  name: 'signup',
  components: {
    RadioButtonGroup
  },
  data() {
    return {
      fields: {
        email: { value: '', placeholder: 'Email', name: 'email', isRequired: true  },
        password: { value: '', placeholder: 'Password', name: 'password', isRequired: true  },
        confirm: { value: '', placeholder: 'Confirm password', name: 'confirm', isRequired: true  },
        fname: { value: '', placeholder: 'First Name', name: 'fname', isRequired: true  },
        lname: { value: '', placeholder: 'Last Name', name: 'lname', isRequired: true  },
        nname: { value: '', placeholder: 'Nick Name', name: 'nname', isRequired: false  },
        phone: { value: '', placeholder: 'Phone', name: 'phone', isRequired: false  },
        gender: { value: '', placeholder: 'Gender', name: 'gender', isRequired: true  }
      },
      genderRadioButtons: [
        'Male',
        'Female',
        'Other'
      ]
    }
  },
  computed: {
    enabledSignUpButton(): Boolean {
      return Boolean(
        this.fields.email.value && 
        this.validEmail && 
        this.fields.password.value && 
        this.fields.confirm.value && 
        this.confirmPassMatch  && 
        this.validPassword  && 
        this.fields.fname.value && 
        this.fields.lname.value && 
        this.validPhone && 
        this.fields.gender.value
      )
    },
    confirmPassMatch(): Boolean {
      return Boolean(this.fields.password.value == this.fields.confirm.value)
    },
    validEmail(): Boolean {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.fields.email.value).toLowerCase()) || this.fields.email.value == ''
    },
    validPassword(): Boolean {
      return (this.fields.password.value.length >= 6) || this.fields.password.value == ''
    },
    validPhone(): Boolean {
      const re = /^[0-9]{3}-[0-9]{3}-[0-9]{4}/
      const reNoDash = /^[0-9]{3}[0-9]{3}[0-9]{4}/
      return reNoDash.test(String(this.fields.phone.value.toLowerCase())) || re.test(String(this.fields.phone.value.toLowerCase())) || this.fields.phone.value == ''
    }
  },
  methods: {
    ...mapActions(['createNewPlayer']),
    ...mapMutations(['updateIsLoggedIn', 'updateLoggedInPlayer', 'updateGlobalToast']),
    setGender(gender: string) {
      this.fields.gender.value = gender
    },
    async signUp() {
      const res = await this.createNewPlayer({
        email: this.fields.email.value,
        password: this.fields.password.value,
        fname: this.fields.fname.value,
        lname: this.fields.lname.value,
        nname: this.fields.nname.value,
        phone: this.fields.phone.value.split('-').join(''),
        gender: this.fields.gender.value
      })
      
      if (res.status == 200) {
        this.updateIsLoggedIn(true)
        this.updateLoggedInPlayer(res.player)
        this.$router.push('/')
      }

      this.updateGlobalToast({
        message: res.message,
        type: res.status == 400 ? TOAST_TYPES.Error : TOAST_TYPES.Success,
        duration: 5000,
        isShowing: true
      })
    },
    formatPhone(e: any, isPhone: boolean) {
      if (isPhone) {
        const phoneWithoutDashes = this.fields.phone.value.split('-').join('')
        const newValue = [
          phoneWithoutDashes.slice(0, 3),
          phoneWithoutDashes.slice(3, 6),
          phoneWithoutDashes.slice(6, 10)
        ]
        if (this.fields.phone.value.length >= 10) {
          this.fields.phone.value = newValue.filter(v => v != "").join('-')
        }
      }
    }
  }
})
import { defineComponent } from "@vue/runtime-core";
import RadioButtonGroup from '@/components/inputs/radio-button-group/index.vue'
import { mapActions, mapMutations } from "vuex";

export default defineComponent({
  name: 'signup',
  components: {
    RadioButtonGroup
  },
  data() {
    return {
      fields: {
        email: { value: '', placeholder: 'Email', name: 'email', isRequired: true, error: ''  },
        password: { value: '', placeholder: 'Password', name: 'password', isRequired: true, error: ''  },
        confirm: { value: '', placeholder: 'Confirm password', name: 'confirm', isRequired: true, error: ''  },
        fname: { value: '', placeholder: 'First Name', name: 'fname', isRequired: true, error: ''  },
        lname: { value: '', placeholder: 'Last Name', name: 'lname', isRequired: true, error: ''  },
        nname: { value: '', placeholder: 'Nick Name', name: 'nname', isRequired: false, error: ''  },
        phone: { value: '', placeholder: 'Phone', name: 'phone', isRequired: false, error: ''  },
        gender: { value: '', placeholder: 'Gender', name: 'gender', isRequired: true, error: ''  }
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
        this.fields.gender.value
      )
    },
    confirmPassMatch(): Boolean {
      return Boolean(this.fields.password.value == this.fields.confirm.value)
    },
    validEmail(): Boolean {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.fields.email.value).toLowerCase())
    },
    validPassword(): Boolean {
      return (this.fields.password.value.length < 6)
    }
  },
  methods: {
    ...mapActions(['createNewPlayer']),
    ...mapMutations(['updateIsLoggedIn', 'updateLoggedInPlayer']),
    setGender(gender: string) {
      this.fields.gender.value = gender
    },
    async signUp() {
      const res = await this.createNewPlayer({
        email: this.fields.email,
        password: this.fields.password,
        fname: this.fields.fname,
        lname: this.fields.lname,
        nname: this.fields.nname,
        phone: this.fields.phone,
        gender: this.fields.gender.value
      })
      if (res.status == 400) {
        console.log('There is an account with this email already')
      } else if (res.status == 200) {
        this.updateIsLoggedIn(true)
        this.updateLoggedInPlayer(res.player)
        this.$router.push('/')
      }
    }
  }
})
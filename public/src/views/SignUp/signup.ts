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
        this.fields.gender.value
      )
    },
    confirmPassMatch(): Boolean {
      return Boolean(this.fields.password.value == this.fields.confirm.value)
    },
    validEmail(): Boolean {
      // TODO
      // Make sure there is some text followed by an @
      // followed by a domain, followed by a . followed by
      // a com or other top level domain
      return true
    },
    validPassword(): Boolean {
      // TODO
      // Do we want to require a capital letter, number,
      // special character and/or minimum num of characters
      return true
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